'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Video, FileText, AlertTriangle, Trophy, Clock, Play, ChevronLeft, Bell, BarChart2, CheckCircle, Lock, MessageCircle, Settings, LogOut, Menu, X } from "lucide-react";
import { getUserProfile, logout } from "@/app/actions/auth";
import Footer from "@/components/Footer";

const sidebarLinks = [
  { href: "/dashboard", label: "الرئيسية", icon: BarChart2 },
  { href: "/dashboard/lectures", label: "الكورسات والمحاضرات", icon: BookOpen },
  { href: "/dashboard/exams", label: "الامتحانات", icon: FileText },
  { href: "/dashboard/mistakes", label: "أخطائي", icon: AlertTriangle },
  { href: "/dashboard/homework", label: "حل الواجب", icon: Play },
  { href: "/dashboard/support", label: "الدعم العلمي", icon: MessageCircle },
];

function SidebarContent({ onClose, student, pathname }: { onClose?: () => void, student: any, pathname: string }) {
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
        {sidebarLinks.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/');
          const isActive = link.href === '/dashboard' ? pathname === '/dashboard' : active;
          return (
            <Link key={link.href} href={link.href} onClick={onClose} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem 0.9rem", borderRadius: "var(--radius-md)", background: isActive ? "var(--primary-50)" : "transparent", color: isActive ? "var(--primary-600)" : "var(--color-text)", fontWeight: isActive ? 700 : 500, fontSize: "0.9rem", transition: "all var(--transition-fast)", borderInlineStart: isActive ? "3px solid var(--primary-500)" : "3px solid transparent" }}>
              <link.icon size={18} />{link.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <Link href="/dashboard/settings" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.9rem", borderRadius: "var(--radius-md)", color: "var(--color-text-muted)", fontWeight: 500, fontSize: "0.9rem" }}><Settings size={18} />الإعدادات</Link>
        <button onClick={() => logout()} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.9rem", borderRadius: "var(--radius-md)", color: "#ef4444", fontWeight: 600, fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "right" }}><LogOut size={18} />تسجيل الخروج</button>
      </div>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState({ name: "جاري التحميل...", gradeLabel: "" });
  const pathname = usePathname();

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
  }, []);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-bg)", display: "flex" }}>
      {sidebarOpen && <div className="mob-overlay" onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40 }} />}
      <aside className="mob-sidebar" style={{ position: "fixed", top: 0, insetInlineEnd: 0, height: "100dvh", width: 260, background: "var(--color-surface)", borderInlineStart: "1px solid var(--color-border)", display: "flex", flexDirection: "column", zIndex: 50, transition: "transform var(--transition-base)", transform: sidebarOpen ? "translateX(0)" : "translateX(105%)", overflowY: "auto" }}>
        <SidebarContent onClose={() => setSidebarOpen(false)} student={student} pathname={pathname} />
      </aside>
      <aside className="desk-sidebar" style={{ width: 260, height: "100dvh", position: "sticky", top: 0, overflowY: "auto", background: "var(--color-surface)", borderInlineStart: "1px solid var(--color-border)", flexDirection: "column", flexShrink: 0, display: "none" }}>
        <SidebarContent student={student} pathname={pathname} />
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 64, background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", padding: "0 1.25rem", gap: "0.75rem", position: "sticky", top: 0, zIndex: 30, boxShadow: "var(--shadow-sm)" }}>
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.1rem", color: "var(--primary-600)", display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ fontSize: "1.4rem" }}>👨‍🏫</span></Link>
          <div style={{ flex: 1 }} />
          <Link href="/dashboard/settings" style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary-100), var(--primary-200))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", border: "2px solid var(--primary-200)" }}>👨‍🎓</Link>
          <button onClick={() => setSidebarOpen(true)} className="mob-menu" style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", border: "1.5px solid var(--color-border)", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-text)" }}><Menu size={20} /></button>
        </header>

        {children}
        <div style={{ marginTop: "auto" }}>
          <Footer />
        </div>
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
