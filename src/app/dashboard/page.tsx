'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Video, FileText, AlertTriangle, Trophy, Clock, Play, ChevronLeft, Bell, BarChart2, CheckCircle, Lock, MessageCircle, Settings, LogOut, Menu, X } from "lucide-react";
import { getUserProfile, logout } from "@/app/actions/auth";
import { getStudentDashboardStats } from "@/app/actions/student";
import VideoModal from "@/components/VideoModal";

const sidebarLinks = [
  { href: "/dashboard", label: "الرئيسية", icon: BarChart2, active: true },
  { href: "/dashboard/lectures", label: "الكورسات والمحاضرات", icon: BookOpen, active: false },
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

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState({ name: "جاري التحميل...", gradeLabel: "", progress: 0 });
  
  const [recentLectures, setRecentLectures] = useState<any[]>([]);
  const [totalLectures, setTotalLectures] = useState(0);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  
  // New state variables for stats
  const [totalCourses, setTotalCourses] = useState(0);
  const [averageGrade, setAverageGrade] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);

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
        setStudent(prev => ({ ...prev, name: profile.full_name || "طالب", gradeLabel: getGradeLabel(profile.grade) + (profile.section === 'languages' ? ' (لغات)' : ' (عربي)') }));
      }
    });

    getStudentDashboardStats().then(data => {
      setRecentLectures(data.recentLectures);
      setTotalLectures(data.totalLectures);
      setCourses(data.courses);
      
      setTotalCourses(data.totalCourses || 0);
      setAverageGrade(data.averageGrade || 0);
      setMistakesCount(data.mistakesCount || 0);
      setStudent(prev => ({ ...prev, progress: data.progress || 0 }));
    });
  }, []);

  const stats = [
    { icon: BookOpen, label: "الكورسات المشترك بها", value: totalCourses.toString(), color: "#3b82f6" },
    { icon: Video, label: "محاضرات متاحة", value: totalLectures.toString(), color: "#6366f1" },
    { icon: Trophy, label: "متوسط الدرجات", value: `${averageGrade}%`, color: "#f59e0b" },
    { icon: AlertTriangle, label: "أخطاء مسجلة", value: mistakesCount.toString(), color: "#ef4444" },
  ];

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

        <main style={{ flex: 1, padding: "1.5rem 1.25rem", maxWidth: 1000, width: "100%", margin: "0 auto" }}>
          
          <div style={{ background: "linear-gradient(135deg, var(--primary-600), var(--primary-800))", borderRadius: "var(--radius-xl)", padding: "2rem", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", boxShadow: "var(--shadow-primary)", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.75rem", marginBottom: "0.5rem" }}>أهلاً بك يا {student.name.split(' ')[0]} 👋</h1>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", maxWidth: 400 }}>لقد أنجزت {student.progress}% من خطتك الأسبوعية. استمر في التفوق!</p>
            </div>
            <div style={{ position: "relative", width: 80, height: 80 }}>
              <svg width="80" height="80" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="10" strokeDasharray={`${student.progress * 2.82} 282`} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem" }}>{student.progress}%</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: stat.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <stat.icon size={22} color={stat.color} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "var(--color-heading)", lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={20} color="var(--primary-500)" />
                الكورسات المتاحة لك
              </h2>
              <Link href="/dashboard/lectures" style={{ color: "var(--primary-600)", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                تصفح الكورسات <ChevronLeft size={16} />
              </Link>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {courses.length === 0 ? (
                <div style={{ color: "var(--color-text-muted)" }}>لا توجد كورسات متاحة حالياً للمرحلة الخاصة بك</div>
              ) : (
                courses.map((course) => (
                  <div key={course.id} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "var(--shadow-sm)", transition: "transform var(--transition-fast)" }} className="hover-card">
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--primary-600)", fontWeight: 700, marginBottom: "0.25rem" }}>كورس دراسي</div>
                      <h3 style={{ fontWeight: 800, color: "var(--color-heading)", fontSize: "1.05rem", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {course.title}
                      </h3>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginTop: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{course.description}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      <Link href={`/dashboard/courses/${course.id}`} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: "var(--radius-md)" }}>
                        تصفح المحتوى
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Recent Lectures */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Play size={20} color="var(--primary-500)" />
                أحدث المحاضرات
              </h2>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {recentLectures.length === 0 ? (
                <div style={{ color: "var(--color-text-muted)" }}>لا توجد محاضرات حالياً</div>
              ) : (
                recentLectures.map((lecture) => (
                  <div key={lecture.id} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "var(--shadow-sm)", transition: "transform var(--transition-fast)" }} className="hover-card">
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--primary-600)", fontWeight: 700, marginBottom: "0.25rem" }}>{lecture.unit_name || lecture.chapter}</div>
                      <h3 style={{ fontWeight: 800, color: "var(--color-heading)", fontSize: "1.05rem", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {lecture.title}
                      </h3>
                      {lecture.lesson_name && <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>{lecture.lesson_name}</div>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      <button onClick={() => setSelectedVideoUrl(lecture.video_url)} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: "var(--radius-md)", border: 'none', cursor: 'pointer' }}>
                        مشاهدة
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>

      <VideoModal
        isOpen={!!selectedVideoUrl}
        videoUrl={selectedVideoUrl || ''}
        onClose={() => setSelectedVideoUrl(null)}
      />

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
