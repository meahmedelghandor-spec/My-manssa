'use server'

import { createClient } from '@/utils/supabase/server'

export async function getStudentCourses() {
  const supabase = await createClient()

  // 1. Get student profile
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return []

  const { data: profile } = await supabase
    .from('profiles')
    .select('grade, section')
    .eq('id', user.id)
    .single()

  if (!profile) return []

  // 2. Fetch courses that match student's grade and section
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('grade', profile.grade)
    .eq('section', profile.section || 'arabic')
    .order('created_at', { ascending: true })

  if (!courses || courses.length === 0) return []

  // Fetch enrollments
  const courseIds = courses.map(c => c.id)
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id, status')
    .eq('student_id', user.id)
    .in('course_id', courseIds)

  return courses.map(course => {
    const enrollment = enrollments?.find(e => e.course_id === course.id)
    return {
      ...course,
      enrollment_status: enrollment ? enrollment.status : (Number(course.price) > 0 ? 'locked' : 'active') // if price 0, default to active
    }
  })
}

export async function getCourseLectures(courseId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "غير مصرح لك" }

  const { data: course } = await supabase.from('courses').select('price').eq('id', courseId).single()
  if (!course) return { error: "الكورس غير موجود" }

  if (Number(course.price) > 0) {
    const { data: enrollment } = await supabase.from('course_enrollments').select('status').eq('course_id', courseId).eq('student_id', user.id).single()
    if (!enrollment || enrollment.status !== 'active') {
      return { locked: true }
    }
  }

  const { data: lectures, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: true })

  if (error || !lectures) return {}

  // Group by unit_name
  const grouped = lectures.reduce((acc: any, lecture) => {
    const unit = lecture.unit_name || lecture.chapter || 'محاضرات عامة'
    if (!acc[unit]) acc[unit] = []
    acc[unit].push(lecture)
    return acc
  }, {})

  return { grouped }
}

export async function getStudentDashboardStats() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { recentLectures: [], totalLectures: 0, courses: [], totalCourses: 0, mistakesCount: 0, averageGrade: 0, progress: 0 }

  const { data: profile } = await supabase
    .from('profiles')
    .select('grade, section')
    .eq('id', user.id)
    .single()

  if (!profile) return { recentLectures: [], totalLectures: 0, courses: [], totalCourses: 0, mistakesCount: 0, averageGrade: 0, progress: 0 }

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('grade', profile.grade)
    .eq('section', profile.section || 'arabic')
    .order('created_at', { ascending: false })

  const courseIds = courses?.map(c => c.id) || []
  const totalCourses = courseIds.length

  let recentLectures: any[] = []
  let totalLectures = 0
  let mistakesCount = 0
  let averageGrade = 0
  let progress = 0

  if (courseIds.length > 0) {
    const { data: lectures } = await supabase
      .from('lectures')
      .select('*')
      .in('course_id', courseIds)
      .order('created_at', { ascending: false })
      .limit(4)
      
    recentLectures = lectures || []

    const { count: lecturesCount } = await supabase
      .from('lectures')
      .select('*', { count: 'exact', head: true })
      .in('course_id', courseIds)
      
    totalLectures = lecturesCount || 0
    
    // Fetch Exams for progress
    const { data: exams } = await supabase
      .from('exams')
      .select('id')
      .in('course_id', courseIds)
      
    const examIds = exams?.map(e => e.id) || []
    
    // Fetch Student Attempts for average grade and progress
    const { data: attempts } = await supabase
      .from('exam_attempts')
      .select('score, total_score, exam_id')
      .eq('student_id', user.id)
      .not('completed_at', 'is', null)
      
    if (attempts && attempts.length > 0) {
      let totalPercentage = 0
      attempts.forEach(att => {
        if (att.total_score && att.total_score > 0) {
          totalPercentage += (att.score / att.total_score) * 100
        }
      })
      averageGrade = Math.round(totalPercentage / attempts.length)
      
      if (examIds.length > 0) {
         const completedExamIds = new Set(attempts.map(a => a.exam_id))
         progress = Math.round((completedExamIds.size / examIds.length) * 100)
      }
    }
  }

  // Fetch Total Mistakes
  const { count: mCount } = await supabase
    .from('student_answers')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', user.id)
    .eq('is_correct', false)
    
  mistakesCount = mCount || 0

  // Fetch enrollments to correctly calculate available courses for stats
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id, status')
    .eq('student_id', user.id)
    .in('course_id', courseIds)

  const coursesWithStatus = courses?.map(course => {
    const enr = enrollments?.find(e => e.course_id === course.id)
    return {
      ...course,
      enrollment_status: enr ? enr.status : (Number(course.price) > 0 ? 'locked' : 'active')
    }
  }) || []

  return {
    recentLectures,
    totalLectures,
    courses: coursesWithStatus.slice(0, 4),
    totalCourses,
    mistakesCount,
    averageGrade,
    progress
  }
}

export async function getStudentExams() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from('profiles')
    .select('grade, section')
    .eq('id', user.id)
    .single()

  if (!profile) return []

  // Fetch courses matching grade/section
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, image_url')
    .eq('grade', profile.grade)
    .eq('section', profile.section || 'arabic')

  if (!courses || courses.length === 0) return []
  
  const courseIds = courses.map(c => c.id)

  // Fetch exams for these courses
  const { data: exams } = await supabase
    .from('exams')
    .select('*')
    .in('course_id', courseIds)
    .order('created_at', { ascending: false })

  if (!exams) return []

  // Add course title/image to exam for UI
  return exams.map(exam => {
    const c = courses.find(c => c.id === exam.course_id)
    return {
      ...exam,
      course_title: c?.title || 'كورس غير معروف',
      course_image: c?.image_url || null
    }
  })
}

export async function getAdminStudents() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { error: "غير مصرح لك" }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!adminProfile || (adminProfile.role !== 'admin' && adminProfile.role !== 'teacher')) {
    return { error: "غير مصرح لك" }
  }

  const { data: students, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data: students }
}
