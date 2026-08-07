'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createLecture(data: {
  title: string
  courseId: string
  unitName: string
  lessonName: string
  videoUrl: string
}) {
  const supabase = await createClient()

  // 1. Verify that the user is an admin/teacher
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "غير مصرح لك بالقيام بهذه العملية" }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
    return { error: "غير مصرح لك بالقيام بهذه العملية (مطلوب حساب معلم أو مدير)" }
  }

  // 2. Insert the lecture into the database
  const { error: insertError } = await supabase
    .from('lectures')
    .insert([
      {
        title: data.title,
        course_id: data.courseId,
        unit_name: data.unitName,
        lesson_name: data.lessonName,
        video_url: data.videoUrl,
      },
    ])

  if (insertError) {
    console.error("Insert error:", insertError)
    return { error: "حدث خطأ أثناء حفظ بيانات المحاضرة في قاعدة البيانات" }
  }

  revalidatePath('/admin')
  revalidatePath('/dashboard/lectures')
  return { success: true }
}

export async function getAdminStats() {
  const supabase = await createClient()

  // Get total students
  const { count: studentsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student')

  // Get total lectures
  const { count: lecturesCount } = await supabase
    .from('lectures')
    .select('*', { count: 'exact', head: true })

  // Get recent lectures
  const { data: recentLectures } = await supabase
    .from('lectures')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    studentsCount: studentsCount || 0,
    lecturesCount: lecturesCount || 0,
    recentLectures: recentLectures || [],
  }
}
