'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Play, CheckCircle, Lock, Clock, Search, ChevronDown, ChevronUp, BarChart2, FileText, AlertTriangle, MessageCircle, Settings, LogOut, Menu, X, BookOpen, ChevronLeft, Image as ImageIcon } from "lucide-react";
import { getStudentCourses } from "@/app/actions/student";
import { getUserProfile, logout } from "@/app/actions/auth";

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

export default function CoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState({ name: "جاري التحميل...", gradeLabel: "" });
  const [courses, setCourses] = useState<any[]>([]);

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

    getStudentCourses().then(data => {
      setCourses(data);
    });
  }, []);

  const filtered = search
    ? courses.filter(c => c.title.includes(search) || (c.description && c.description.includes(search)))
    : courses;

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
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "var(--color-heading)", marginBottom: "0.3rem" }}>📚 الكورسات</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>تصفح الكورسات المتاحة للمرحلة الخاصة بك</p>
          </div>

          <div style={{ position: "relative", marginBottom: "2rem" }}>
            <Search size={16} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", insetInlineStart: "0.9rem", color: "var(--color-text-muted)" }} />
            <input type="text" className="form-input" placeholder="ابحث عن كورس..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingInlineStart: "2.5rem" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)", gridColumn: "1 / -1" }}>لا توجد كورسات متاحة حالياً</div>
            ) : (
              filtered.map((course) => (
                <div key={course.id} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-sm)", transition: "transform var(--transition-fast)" }} className="hover-card">
                  {course.image_url ? (
                    <div style={{ width: '100%', height: 160, backgroundImage: `url(${course.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--color-border)', position: 'relative' }}>
                      {course.enrollment_status === 'locked' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={32} color="#fff" /></div>}
                      {course.enrollment_status === 'pending' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={32} color="#fff" /></div>}
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: 160, background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)', position: 'relative' }}>
                      <ImageIcon size={48} color="var(--primary-300)" />
                      {course.enrollment_status === 'locked' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={32} color="#fff" /></div>}
                      {course.enrollment_status === 'pending' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={32} color="#fff" /></div>}
                    </div>
                  )}
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <h3 style={{ fontWeight: 900, fontFamily: "var(--font-display)", color: "var(--color-heading)", fontSize: "1.1rem", lineHeight: 1.4, marginBottom: "0.5rem" }}>
                        {course.title}
                      </h3>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {course.description || "لا يوجد وصف متاح"}
                      </p>
                    </div>
                    <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
                      {course.enrollment_status === 'locked' ? (
                        <Link href={`/dashboard/courses/${course.id}/enroll`} className="btn btn-primary" style={{ width: "100%", padding: "0.6rem 1rem", fontSize: "0.9rem", borderRadius: "var(--radius-md)", justifyContent: "center", background: 'var(--color-surface)', color: 'var(--primary-600)', border: '1px solid var(--primary-200)' }}>
                          <Lock size={16} style={{ marginInlineEnd: 4 }} /> اشترك الآن
                        </Link>
                      ) : course.enrollment_status === 'pending' ? (
                        <button disabled className="btn" style={{ width: "100%", padding: "0.6rem 1rem", fontSize: "0.9rem", borderRadius: "var(--radius-md)", justifyContent: "center", background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' }}>
                          <Clock size={16} style={{ marginInlineEnd: 4 }} /> قيد المراجعة
                        </button>
                      ) : (
                        <Link href={`/dashboard/courses/${course.id}`} className="btn btn-primary" style={{ width: "100%", padding: "0.6rem 1rem", fontSize: "0.9rem", borderRadius: "var(--radius-md)", justifyContent: "center" }}>
                          تصفح المحتوى <ChevronLeft size={16} style={{ marginInlineStart: 4 }} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>
      </div>

      <style>{`
        .mob-menu { display: flex !important; }
        .desk-sidebar { display: none !important; }
        .mob-sidebar { display: flex !important; }
        .hover-card:hover { transform: translateY(-3px); border-color: var(--primary-300); }
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
