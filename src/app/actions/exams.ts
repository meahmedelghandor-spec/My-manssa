'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createExam(data: { course_id: string; title: string; description?: string; time_limit_minutes: number }) {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك" }

  const { data: inserted, error } = await supabase
    .from('exams')
    .insert([{
      course_id: data.course_id,
      title: data.title,
      description: data.description,
      time_limit_minutes: data.time_limit_minutes,
      created_by: user.user.id
    }])
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath(`/admin/courses/${data.course_id}`)
  return { success: true, exam: inserted }
}

export async function addQuestionToExam(data: { exam_id: string; question_text: string; image_url?: string; options: string[]; correct_option_index: number; points: number }) {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك" }

  const { error } = await supabase
    .from('questions')
    .insert([{
      exam_id: data.exam_id,
      question_text: data.question_text,
      image_url: data.image_url,
      options: data.options,
      correct_option_index: data.correct_option_index,
      points: data.points
    }])

  if (error) return { error: error.message }
  return { success: true }
}

export async function getExamsByCourse(course_id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('course_id', course_id)
    .order('created_at', { ascending: true })

  if (error) return []
  return data
}

export async function getExamWithQuestions(exam_id: string) {
  const supabase = await createClient()
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('*')
    .eq('id', exam_id)
    .single()

  if (examError || !exam) return null

  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('*')
    .eq('exam_id', exam_id)
    .order('created_at', { ascending: true })

  return { ...exam, questions: questions || [] }
}

export async function submitExamAttempt(exam_id: string, answers: { question_id: string; selected_index: number }[]) {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return { error: "غير مصرح لك" }

  const examData = await getExamWithQuestions(exam_id)
  if (!examData) return { error: "الامتحان غير موجود" }

  let score = 0
  let totalScore = 0

  const studentAnswersToInsert = []

  for (const q of examData.questions) {
    totalScore += q.points
    const studentAnswer = answers.find(a => a.question_id === q.id)
    let is_correct = false
    let selected_option_index = null

    if (studentAnswer) {
      selected_option_index = studentAnswer.selected_index
      if (studentAnswer.selected_index === q.correct_option_index) {
        is_correct = true
        score += q.points
      }
    }

    studentAnswersToInsert.push({
      question_id: q.id,
      student_id: user.user.id,
      selected_option_index,
      is_correct
    })
  }

  // Record attempt
  const { data: attempt, error: attemptError } = await supabase
    .from('exam_attempts')
    .insert([{
      exam_id,
      student_id: user.user.id,
      score,
      total_score: totalScore,
      completed_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (attemptError) return { error: attemptError.message }

  // Record answers
  const answersWithAttemptId = studentAnswersToInsert.map(a => ({ ...a, attempt_id: attempt.id }))
  await supabase.from('student_answers').insert(answersWithAttemptId)

  return { success: true, score, totalScore, attemptId: attempt.id }
}

export async function getStudentMistakes() {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) return []

  // Get wrong answers with the question details
  const { data, error } = await supabase
    .from('student_answers')
    .select(`
      id,
      selected_option_index,
      created_at,
      question:questions (
        id,
        question_text,
        options,
        correct_option_index,
        exam:exams (
          title,
          course:courses (
            title
          )
        )
      )
    `)
    .eq('student_id', user.user.id)
    .eq('is_correct', false)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}
