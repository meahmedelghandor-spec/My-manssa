'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createHomework(data: { course_id: string; title: string; description?: string; file_url?: string; due_date?: string }) {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك" }

  const { data: inserted, error } = await supabase
    .from('homeworks')
    .insert([{
      course_id: data.course_id,
      title: data.title,
      description: data.description,
      file_url: data.file_url,
      due_date: data.due_date || null,
      created_by: user.user.id
    }])
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath(`/admin/courses/${data.course_id}`)
  return { success: true, homework: inserted }
}

export async function getHomeworksByCourse(course_id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('homeworks')
    .select('*')
    .eq('course_id', course_id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

export async function getStudentHomeworks() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from('profiles')
    .select('grade, section')
    .eq('id', user.id)
    .single()

  if (!profile) return []

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title')
    .eq('grade', profile.grade)
    .eq('section', profile.section || 'arabic')

  if (!courses || courses.length === 0) return []
  
  const courseIds = courses.map(c => c.id)

  const { data: homeworks } = await supabase
    .from('homeworks')
    .select('*')
    .in('course_id', courseIds)
    .order('created_at', { ascending: false })

  if (!homeworks) return []

  // Get submissions for this student
  const { data: submissions } = await supabase
    .from('homework_submissions')
    .select('*')
    .eq('student_id', user.id)

  // Combine data
  return homeworks.map(hw => {
    const course = courses.find(c => c.id === hw.course_id)
    const submission = submissions?.find(s => s.homework_id === hw.id)
    return {
      ...hw,
      course_title: course?.title || 'كورس غير معروف',
      submission: submission || null
    }
  })
}

export async function submitHomework(homework_id: string, file_url: string) {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك" }

  const { error } = await supabase
    .from('homework_submissions')
    .insert([{
      homework_id,
      student_id: user.user.id,
      file_url
    }])

  if (error) {
    if (error.code === '23505') return { error: "لقد قمت بتسليم هذا الواجب مسبقاً" } // unique constraint violation
    return { error: error.message }
  }
  
  return { success: true }
}
