-- 1. Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create ticket_messages table
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Support Tickets Policies
CREATE POLICY "Students view own tickets" ON public.support_tickets FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Teachers view all tickets" ON public.support_tickets FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))
);
CREATE POLICY "Students insert own tickets" ON public.support_tickets FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Teachers can update tickets" ON public.support_tickets FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))
);

-- Ticket Messages Policies
CREATE POLICY "View messages for visible tickets" ON public.ticket_messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.support_tickets WHERE public.support_tickets.id = ticket_id AND (public.support_tickets.student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))))
);
CREATE POLICY "Insert messages for visible tickets" ON public.ticket_messages FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.support_tickets WHERE public.support_tickets.id = ticket_id AND (public.support_tickets.student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))))
);
