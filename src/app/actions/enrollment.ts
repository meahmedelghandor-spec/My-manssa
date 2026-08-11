'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'

export async function submitEnrollment(data: { course_id: string; payment_method: string; payment_number: string; receipt_url: string }) {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك" }

  const { error } = await supabase
    .from('course_enrollments')
    .insert([{
      course_id: data.course_id,
      student_id: user.user.id,
      status: 'pending',
      payment_method: data.payment_method,
      payment_number: data.payment_number,
      receipt_url: data.receipt_url
    }])

  if (error) {
    if (error.code === '23505') return { error: "لقد قمت بطلب اشتراك في هذا الكورس مسبقاً، يرجى انتظار المراجعة." }
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/lectures')
  return { success: true }
}

export async function getAdminEnrollments() {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return []

  const { data: enrollments, error } = await supabase
    .from('course_enrollments')
    .select(`
      *,
      course:courses(title, price, grade)
    `)
    .order('created_at', { ascending: false })

  if (error || !enrollments) {
    console.error("Error fetching enrollments:", error);
    return []
  }

  const studentIds = enrollments.map(e => e.student_id)
  let profiles: any[] = []
  if (studentIds.length > 0) {
    const { data: pData } = await supabase.from('profiles').select('id, full_name, grade').in('id', studentIds)
    if (pData) profiles = pData
  }

  return enrollments.map(e => ({
    ...e,
    student: profiles.find(p => p.id === e.student_id)
  }))
}

export async function updateEnrollmentStatus(enrollmentId: string, status: 'active' | 'rejected') {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك" }

  const { error } = await supabase
    .from('course_enrollments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', enrollmentId)

  if (error) return { error: error.message }
  
  // If activated, send notification to student
  if (status === 'active') {
    // We need the student ID to send the notification. We can query it or get it before update.
    // Let's get the enrollment details first to get the student_id and course title.
    const { data: enrollmentData } = await supabase
      .from('course_enrollments')
      .select('student_id, course:courses(title)')
      .eq('id', enrollmentId)
      .single()
      
    if (enrollmentData) {
      const courseTitle = (enrollmentData.course as any)?.title || 'الكورس';
      await createNotification(
        enrollmentData.student_id,
        "تم تفعيل اشتراكك",
        `تم بنجاح تفعيل اشتراكك في: ${courseTitle}. يمكنك الآن بدء المذاكرة.`
      )
    }
  }

  revalidatePath('/admin/payments')
  return { success: true }
}
