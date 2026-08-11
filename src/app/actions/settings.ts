'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateProfileSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'يجب تسجيل الدخول أولاً' }
  }

  const secondaryPhone = formData.get('secondaryPhone') as string
  const contactEmail = formData.get('contactEmail') as string
  const grade = formData.get('grade') as string
  const section = formData.get('section') as string

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      secondary_phone: secondaryPhone,
      contact_email: contactEmail,
      grade: grade,
      section: section,
    })
    .eq('id', user.id)

  if (error) {
    return { error: 'حدث خطأ أثناء تحديث البيانات' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function updatePasswordSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'يجب تسجيل الدخول أولاً' }
  }

  const password = formData.get('password') as string

  if (!password || password.length < 6) {
    return { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: 'حدث خطأ أثناء تحديث كلمة المرور' }
  }

  return { success: true }
}
