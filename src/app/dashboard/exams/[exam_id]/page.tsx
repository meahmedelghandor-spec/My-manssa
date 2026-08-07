'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { getExamWithQuestions, submitExamAttempt } from '@/app/actions/exams';

export default function TakeExamPage() {
  const params = useParams();
  const examId = params?.exam_id as string;
  
  const [exam, setExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number, totalScore: number } | null>(null);

  useEffect(() => {
    if (!examId) return;
    getExamWithQuestions(examId).then(data => {
      setExam(data);
      setIsLoading(false);
    });
  }, [examId]);

  const handleSelectOption = (questionId: string, index: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: index }));
  };

  const handleSubmit = async () => {
    if (!exam) return;
    // ensure all questions are answered? we can just submit what they have
    setIsSubmitting(true);
    
    const answersArray = Object.entries(answers).map(([qId, index]) => ({
      question_id: qId,
      selected_index: index
    }));

    const res = await submitExamAttempt(examId, answersArray);
    if (res.success) {
      setResult({ score: res.score, totalScore: res.totalScore });
    } else {
      alert(res.error || 'حدث خطأ أثناء إرسال الإجابات');
    }
    setIsSubmitting(false);
  };

  if (isLoading) return <div style={{ padding: '3rem', textAlign: 'center' }}>جاري تحميل الامتحان...</div>;
  if (!exam) return <div style={{ padding: '3rem', textAlign: 'center' }}>الامتحان غير موجود</div>;

  if (result) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: 'var(--color-surface)', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', textAlign: 'center', maxWidth: 500, width: '100%', boxShadow: 'var(--shadow-lg)' }}>
          <CheckCircle size={64} color="var(--primary-500)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2rem', color: 'var(--color-heading)', marginBottom: '1rem' }}>
            تم إنهاء الامتحان!
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            لقد حصلت على:
          </p>
          <div style={{ background: 'var(--primary-50)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'inline-block', marginBottom: '2rem' }}>
            <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-600)' }}>
              {result.score} <span style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>/ {result.totalScore}</span>
            </span>
          </div>
          <br />
          <Link href="/dashboard/exams" className="btn btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: 'var(--radius-full)' }}>
            العودة للامتحانات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)', paddingBottom: '5rem' }}>
      <header style={{ background: 'var(--color-surface)', padding: '1rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/dashboard/exams" className="btn btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <ChevronRight size={24} />
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem', color: 'var(--color-heading)' }}>
            {exam.title}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef3c7', color: '#d97706', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
          <Clock size={18} />
          {exam.time_limit_minutes} دقيقة
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
        {exam.questions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <AlertTriangle size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>لا توجد أسئلة</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>لم يقم المعلم بإضافة أسئلة لهذا الامتحان بعد.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {exam.questions.map((q: any, idx: number) => (
              <div key={q.id} style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>
                    {idx + 1}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-heading)', lineHeight: 1.6, marginTop: '0.25rem' }}>
                    {q.question_text}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingInlineStart: '3.25rem' }}>
                  {q.options.map((opt: string, optIdx: number) => {
                    const isSelected = answers[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
                          background: isSelected ? 'var(--primary-50)' : 'var(--color-bg)',
                          border: isSelected ? '2px solid var(--primary-500)' : '2px solid var(--color-border)',
                          borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.2s ease',
                          textAlign: 'start', fontFamily: 'inherit', fontSize: '1rem', color: isSelected ? 'var(--primary-700)' : 'var(--color-text)'
                        }}
                      >
                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: isSelected ? '6px solid var(--primary-500)' : '2px solid var(--color-border-strong)', flexShrink: 0, transition: 'all 0.2s ease' }} />
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting || Object.keys(answers).length !== exam.questions.length}
                className="btn btn-primary" 
                style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: 'var(--radius-full)', opacity: (isSubmitting || Object.keys(answers).length !== exam.questions.length) ? 0.5 : 1 }}
              >
                {isSubmitting ? 'جاري الإرسال...' : 'تسليم الامتحان'}
              </button>
            </div>
            {Object.keys(answers).length !== exam.questions.length && (
              <p style={{ textAlign: 'end', color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                * يرجى الإجابة على جميع الأسئلة لتتمكن من التسليم.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
