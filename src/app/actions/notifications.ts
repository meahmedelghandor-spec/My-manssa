'use server'

import { createClient } from '@/utils/supabase/server'

export async function getUserNotifications() {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
  return data || []
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) return { success: false }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', user.user.id)

  if (error) {
    console.error("Error updating notification:", error)
    return { success: false }
  }
  return { success: true }
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) return { success: false }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.user.id)
    .eq('is_read', false)

  if (error) {
    console.error("Error updating notifications:", error)
    return { success: false }
  }
  return { success: true }
}

export async function createNotification(userId: string, title: string, message: string) {
  const supabase = await createClient()
  
  // Note: Since this is often called by admin actions, we trust the caller.
  const { error } = await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      title: title,
      message: message
    }])

  if (error) {
    console.error("Error creating notification:", error)
    return { success: false, error: error.message }
  }
  
  return { success: true }
}
