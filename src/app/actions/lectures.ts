'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLecture(data: { course_id: string; title: string; description?: string; video_url: string; chapter?: string; unit_name?: string; lesson_name?: string }) {
  const supabase = await createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك بإضافة محاضرة" }

  const { error } = await supabase
    .from('lectures')
    .insert([{
      course_id: data.course_id,
      title: data.title,
      description: data.description,
      video_url: data.video_url,
      chapter: data.chapter,
      unit_name: data.unit_name,
      lesson_name: data.lesson_name,
    }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/courses/${data.course_id}`)
  return { success: true }
}

export async function getLecturesByCourse(courseId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

export async function deleteLecture(lectureId: string, courseId: string) {
  const supabase = await createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك بحذف محاضرة" }

  const { error } = await supabase
    .from('lectures')
    .delete()
    .eq('id', lectureId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}
