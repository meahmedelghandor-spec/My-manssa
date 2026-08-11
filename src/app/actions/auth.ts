'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

const generateEmailFromPhone = (phone: string) => {
  if (phone.includes('@')) return phone.trim();
  return `${phone.trim()}@mr-ahmed.com`;
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const phone = formData.get('phone') as string
  const password = formData.get('password') as string

  const data = {
    email: generateEmailFromPhone(phone),
    password: password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: 'رقم التليفون أو كلمة المرور غير صحيحة' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// Function to send WhatsApp message using CallMeBot
async function sendWhatsAppNotification(fullName: string, phone: string, grade: string, section: string) {
  const adminPhone = "201091264904";
  const apiKey = "5753015";
  
  const grades: Record<string, string> = {
    prep_1: 'الصف الأول الإعدادي', prep_2: 'الصف الثاني الإعدادي', prep_3: 'الصف الثالث الإعدادي',
    sec_1: 'الصف الأول الثانوي', sec_2: 'الصف الثاني الثانوي', sec_3: 'الصف الثالث الثانوي'
  };
  const gradeLabel = grades[grade] || grade;
  const sectionLabel = section === 'languages' ? 'لغات' : 'عربي';

  const message = `🎉 تسجيل طالب جديد!\n👤 الاسم: ${fullName}\n📱 الموبايل: ${phone}\n📚 الصف: ${gradeLabel} (${sectionLabel})`;
  const encodedMessage = encodeURIComponent(message);
  
  const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodedMessage}&apikey=${apiKey}`;
  
  try {
    await fetch(url, { method: 'GET' });
    console.log("WhatsApp notification sent for:", fullName);
  } catch (error) {
    console.error("Failed to send WhatsApp notification:", error);
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const phone = formData.get('phone') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const grade = formData.get('grade') as string

  const section = formData.get('section') as string

  // 1. Sign up the user in Supabase Auth and pass metadata for the database trigger
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: generateEmailFromPhone(phone),
    password,
    options: {
      data: {
        full_name: fullName,
        grade: grade,
        section: section,
      }
    }
  })

  if (authError) {
    return { error: 'حدث خطأ أثناء إنشاء الحساب: ' + authError.message }
  }

  // 3. Send WhatsApp Notification to Admin
  await sendWhatsAppNotification(fullName, phone, grade, section);

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  return { ...user, ...profile }
}
