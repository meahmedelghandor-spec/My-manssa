'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getLandingSettings() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('landing_page_settings')
    .select('*')

  if (error) {
    console.error("Error fetching landing settings:", error)
    return {}
  }

  // Convert array of {setting_key, setting_value} into an object map
  const settings: Record<string, any> = {}
  data.forEach((row) => {
    settings[row.setting_key] = row.setting_value
  })

  return settings
}

export async function updateLandingSetting(key: string, value: any) {
  const supabase = await createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك" }

  const { error } = await supabase
    .from('landing_page_settings')
    .upsert({ 
      setting_key: key, 
      setting_value: value,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'setting_key'
    })

  if (error) {
    console.error("Error updating landing setting:", error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/settings/landing')
  return { success: true }
}
