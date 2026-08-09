'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Play, CheckCircle, Lock, Clock, Search, ChevronDown, ChevronUp, BarChart2, FileText, AlertTriangle, MessageCircle, Settings, LogOut, Menu, X, BookOpen } from "lucide-react";
import { getStudentMistakes } from "@/app/actions/exams";
import { getUserProfile, logout } from "@/app/actions/auth";

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    getStudentMistakes().then(data => {
      setMistakes(data);
      setIsLoading(false);
    });
  }, []);

  return (
        <main style={{ padding: "1.5rem 1.25rem", maxWidth: 900, width: "100%", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "var(--color-heading)", marginBottom: "0.3rem" }}>⚠️ أخطائي</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>راجع الأسئلة التي أخطأت فيها لتتعلم من أخطائك</p>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>جاري التحميل...</div>
          ) : mistakes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)" }}>
              <CheckCircle size={64} color="var(--primary-500)" style={{ margin: "0 auto 1rem" }} />
              <h4 style={{ color: "var(--color-heading)", fontWeight: 700, marginBottom: "0.5rem" }}>ممتاز جداً!</h4>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>ليس لديك أي أخطاء مسجلة في الامتحانات حتى الآن.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {mistakes.map((mistake) => (
                <div key={mistake.id} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                      <span style={{ background: "var(--primary-50)", color: "var(--primary-600)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700 }}>
                        {mistake.question.exam?.course?.title || 'كورس غير معروف'}
                      </span>
                      <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
                        امتحان: {mistake.question.exam?.title}
                      </span>
                    </div>
                  </div>
                  
                  <h3 style={{ fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--color-heading)", fontSize: "1.1rem", lineHeight: 1.6 }}>
                    {mistake.question.question_text}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {mistake.question.options.map((opt: string, idx: number) => {
                      const isCorrect = mistake.question.correct_option_index === idx;
                      const isSelectedWrong = mistake.selected_option_index === idx;
                      
                      let bg = 'var(--color-bg)';
                      let border = '1px solid var(--color-border)';
                      let icon = null;

                      if (isCorrect) {
                        bg = '#ecfdf5';
                        border = '1px solid #10b981';
                        icon = <CheckCircle size={16} color="#10b981" />;
                      } else if (isSelectedWrong) {
                        bg = '#fef2f2';
                        border = '1px solid #ef4444';
                        icon = <X size={16} color="#ef4444" />;
                      }

                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: bg, border, borderRadius: 'var(--radius-md)' }}>
                          {icon || <div style={{ width: 16 }} />}
                          <span style={{ color: isCorrect ? '#065f46' : isSelectedWrong ? '#991b1b' : 'var(--color-text)', fontSize: '0.95rem' }}>{opt}</span>
                          {isSelectedWrong && <span style={{ marginInlineStart: 'auto', fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>إجابتك</span>}
                          {isCorrect && <span style={{ marginInlineStart: 'auto', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>الإجابة الصحيحة</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
  );
}
