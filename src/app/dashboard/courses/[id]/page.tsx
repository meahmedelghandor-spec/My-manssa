"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Play, ChevronLeft, ChevronDown, ChevronUp, BarChart2, FileText, AlertTriangle, MessageCircle, Settings, LogOut, Menu, X, BookOpen, ArrowRight } from "lucide-react";
import { getCourseLectures } from "@/app/actions/student";
import { getUserProfile, logout } from "@/app/actions/auth";
import { useParams, useRouter } from "next/navigation";

const sidebarLinks = [
  { href: "/dashboard", label: "الرئيسية", icon: BarChart2, active: false },
  { href: "/dashboard/lectures", label: "الكورسات والمحاضرات", icon: BookOpen, active: true },
  { href: "/dashboard/exams", label: "الامتحانات", icon: FileText, active: false },
  { href: "/dashboard/mistakes", label: "أخطائي", icon: AlertTriangle, active: false },
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

export default function CourseDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState({ name: "جاري التحميل...", gradeLabel: "" });
  const [openUnits, setOpenUnits] = useState<string[]>([]);
  const [units, setUnits] = useState<any[]>([]);

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

    getCourseLectures(id).then(res => {
      if (res.locked) {
        router.replace(`/dashboard/courses/${id}/enroll`);
        return;
      }
      if (res.grouped) {
        const formatted = Object.keys(res.grouped).map(unit => ({
          id: unit,
          title: unit,
          lectures: res.grouped[unit]
        }));
        setUnits(formatted);
        if (formatted.length > 0) {
          setOpenUnits([formatted[0].id]);
        }
      }
    });
  }, [id, router]);

  const toggleUnit = (unitId: string) => {
    setOpenUnits((prev) => prev.includes(unitId) ? prev.filter((u) => u !== unitId) : [...prev, unitId]);
  };

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
          
          <Link href="/dashboard/lectures" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1.5rem", textDecoration: "none" }}>
            <ArrowRight size={16} /> العودة للكورسات
          </Link>

          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "var(--color-heading)", marginBottom: "0.3rem" }}>محتوى الكورس</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>جميع الوحدات والدروس الخاصة بهذا الكورس</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {units.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>لا توجد محاضرات متاحة حالياً في هذا الكورس</div>
            ) : (
              units.map((unit) => {
                const isOpen = openUnits.includes(unit.id);
                return (
                  <div key={unit.id} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                    <div onClick={() => toggleUnit(unit.id)} style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: isOpen ? "var(--primary-50)" : "transparent", transition: "background 0.3s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: isOpen ? "var(--primary-200)" : "var(--color-bg)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: isOpen ? "var(--primary-700)" : "var(--color-text)" }}>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        <div>
                          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--color-heading)" }}>{unit.title}</h2>
                          <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.15rem" }}>{unit.lectures.length} دروس ومحاضرات</div>
                        </div>
                      </div>
                    </div>
                    {isOpen && (
                      <div style={{ padding: "0.5rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {unit.lectures.map((lec: any) => (
                          <div key={lec.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-bg)" }}>
                            <div style={{ width: 44, height: 44, borderRadius: "10px", background: "var(--primary-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Video size={22} color="var(--primary-600)" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 800, color: "var(--color-heading)", fontSize: "0.95rem" }}>{lec.title}</div>
                              {lec.lesson_name && <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>{lec.lesson_name}</div>}
                            </div>
                            <a href={lec.video_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: "var(--radius-md)", flexShrink: 0 }}>
                              مشاهدة
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

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
