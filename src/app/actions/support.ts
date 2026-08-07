'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTicket(subject: string, message: string) {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك" }

  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .insert([{ student_id: user.user.id, subject }])
    .select()
    .single()

  if (ticketError) return { error: ticketError.message }

  const { error: msgError } = await supabase
    .from('ticket_messages')
    .insert([{ ticket_id: ticket.id, sender_id: user.user.id, message }])

  if (msgError) return { error: msgError.message }

  return { success: true, ticket }
}

export async function getStudentTickets() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return []

  const { data } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('student_id', user.user.id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function getAllTickets() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*, profiles!student_id(full_name, grade, section)')
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

export async function getTicketMessages(ticket_id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ticket_messages')
    .select('*, profiles!sender_id(full_name, role)')
    .eq('ticket_id', ticket_id)
    .order('created_at', { ascending: true })

  if (error) return []
  return data
}

export async function addMessageToTicket(ticket_id: string, message: string) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return { error: "غير مصرح لك" }

  const { error } = await supabase
    .from('ticket_messages')
    .insert([{ ticket_id, sender_id: user.user.id, message }])

  if (error) return { error: error.message }
  
  // Update ticket updated_at
  await supabase.from('support_tickets').update({ updated_at: new Date().toISOString() }).eq('id', ticket_id)
  
  return { success: true }
}

export async function closeTicket(ticket_id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('support_tickets')
    .update({ status: 'closed' })
    .eq('id', ticket_id)

  if (error) return { error: error.message }
  revalidatePath('/admin/support')
  return { success: true }
}
