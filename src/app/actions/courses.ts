'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCourse(data: { title: string; description: string; grade: string; section: string; image_url?: string; price?: number }) {
  const supabase = await createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك بإنشاء كورس" }

  const { error } = await supabase
    .from('courses')
    .insert([{
      title: data.title,
      description: data.description,
      grade: data.grade,
      section: data.section,
      image_url: data.image_url,
      price: data.price || 0,
      created_by: user.user.id
    }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function getAdminCourses() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return data
}

export async function updateCourse(id: string, data: { title: string; description: string; grade: string; section: string; image_url?: string; price?: number }) {
  const supabase = await createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك" }

  const updateData: any = {
    title: data.title,
    description: data.description,
    grade: data.grade,
    section: data.section,
    price: data.price || 0,
  }
  if (data.image_url) {
    updateData.image_url = data.image_url
  }

  const { error } = await supabase
    .from('courses')
    .update(updateData)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/admin/courses')
  return { success: true }
}

export async function deleteCourse(id: string) {
  const supabase = await createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك" }

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/admin/courses')
  return { success: true }
}

export async function getRecentCourses() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    return []
  }

  return data
}
