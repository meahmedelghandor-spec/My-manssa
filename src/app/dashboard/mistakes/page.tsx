'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Play, CheckCircle, Lock, Clock, Search, ChevronDown, ChevronUp, BarChart2, FileText, AlertTriangle, MessageCircle, Settings, LogOut, Menu, X, BookOpen } from "lucide-react";
import { getStudentMistakes } from "@/app/actions/exams";
import { getUserProfile, logout } from "@/app/actions/auth";

const sidebarLinks = [
  { href: "/dashboard", label: "الرئيسية", icon: BarChart2, active: false },
  { href: "/dashboard/lectures", label: "الكورسات والمحاضرات", icon: BookOpen, active: false },
  { href: "/dashboard/exams", label: "الامتحانات", icon: FileText, active: false },
  { href: "/dashboard/mistakes", label: "أخطائي", icon: AlertTriangle, active: true },
  { href: "/dashboard/homework", label: "حل الواجب", icon: Play, active: false },
  { href: "/dashboard/support", label: "الدعم العلمي", icon: MessageCircle, active: false },
];

function SidebarContent({ onClose, student }: { onClose?: () => void, student: any }) {
  return (
    <>
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary-100), var(--primary-200))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0, border: "2px solid var(--primary-200)" }}>👨‍🎓</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 700, color: "var(--color-heading)", fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{student.gradeLabel}</div>
        </div>
        {onClose && <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", padding: 4 }}><X size={18} /></button>}
      </div>
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {sidebarLinks.map((link) => (
          <Link key={link.href} href={link.href} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem 0.9rem", borderRadius: "var(--radius-md)", background: link.active ? "var(--primary-50)" : "transparent", color: link.active ? "var(--primary-600)" : "var(--color-text)", fontWeight: link.active ? 700 : 500, fontSize: "0.9rem", transition: "all var(--transition-fast)", borderInlineStart: link.active ? "3px solid var(--primary-500)" : "3px solid transparent" }}>
            <link.icon size={18} />{link.label}
          </Link>
        ))}
      </nav>
      <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <Link href="/dashboard/settings" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.9rem", borderRadius: "var(--radius-md)", color: "var(--color-text-muted)", fontWeight: 500, fontSize: "0.9rem" }}><Settings size={18} />الإعدادات</Link>
        <button onClick={() => logout()} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.9rem", borderRadius: "var(--radius-md)", color: "#ef4444", fontWeight: 600, fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "right" }}><LogOut size={18} />تسجيل الخروج</button>
      </div>
    </>
  );
}

export default function MistakesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState({ name: "جاري التحميل...", gradeLabel: "" });
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getGradeLabel = (gId: string) => {
    const grades: Record<string, string> = {
      prep_1: 'الصف الأول الإعدادي', prep_2: 'الصف الثاني الإعدادي', prep_3: 'الصف الثالث الإعدادي',
      sec_1: 'الصف الأول الثانوي', sec_2: 'الصف الثاني الثانوي', sec_3: 'الصف الثالث الثانوي'
    };
    return grades[gId] || gId;
  };

  useEffect(() => {
    getUserProfile().then(profile => {
      if(profile) {
        setStudent({ name: profile.full_name || "طالب", gradeLabel: getGradeLabel(profile.grade) + (profile.section === 'languages' ? ' (لغات)' : ' (عربي)') });
      }
    });

    getStudentMistakes().then(data => {
      setMistakes(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-bg)", display: "flex" }}>
      {sidebarOpen && <div className="mob-overlay" onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40 }} />}
      <aside className="mob-sidebar" style={{ position: "fixed", top: 0, insetInlineEnd: 0, height: "100dvh", width: 260, background: "var(--color-surface)", borderInlineStart: "1px solid var(--color-border)", display: "flex", flexDirection: "column", zIndex: 50, transition: "transform var(--transition-base)", transform: sidebarOpen ? "translateX(0)" : "translateX(105%)", overflowY: "auto" }}>
        <SidebarContent onClose={() => setSidebarOpen(false)} student={student} />
      </aside>
      <aside className="desk-sidebar" style={{ width: 260, minHeight: "100dvh", background: "var(--color-surface)", borderInlineStart: "1px solid var(--color-border)", flexDirection: "column", flexShrink: 0, display: "none" }}>
        <SidebarContent student={student} />
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 64, background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", padding: "0 1.25rem", gap: "0.75rem", position: "sticky", top: 0, zIndex: 30, boxShadow: "var(--shadow-sm)" }}>
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.1rem", color: "var(--primary-600)", display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ fontSize: "1.4rem" }}>👨‍🏫</span></Link>
          <div style={{ flex: 1 }} />
          <Link href="/dashboard/settings" style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary-100), var(--primary-200))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", border: "2px solid var(--primary-200)" }}>👨‍🎓</Link>
          <button onClick={() => setSidebarOpen(true)} className="mob-menu" style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", border: "1.5px solid var(--color-border)", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-text)" }}><Menu size={20} /></button>
        </header>

        <main style={{ flex: 1, padding: "1.5rem 1.25rem", maxWidth: 900, width: "100%", margin: "0 auto" }}>
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
      </div>

      <style>{`
        .mob-menu { display: flex !important; }
        .desk-sidebar { display: none !important; }
        .mob-sidebar { display: flex !important; }
        @media (min-width: 900px) {
          .mob-menu { display: none !important; }
          .mob-overlay { display: none !important; }
          .mob-sidebar { display: none !important; }
          .desk-sidebar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
