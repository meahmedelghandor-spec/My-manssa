"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  BookOpen,
  MessageCircle,
  CreditCard
} from "lucide-react";
import { getUserProfile, logout } from "@/app/actions/auth";

const sidebarLinks = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/courses", label: "الكورسات", icon: BookOpen },
  { href: "/admin/lectures", label: "المحاضرات والمحتوى", icon: Video },
  { href: "/admin/exams", label: "الامتحانات", icon: FileText },
  { href: "/admin/students", label: "الطلاب", icon: Users },
  { href: "/admin/support", label: "الدعم العلمي", icon: MessageCircle },
  { href: "/admin/payments", label: "المدفوعات", icon: CreditCard },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const [admin, setAdmin] = useState({ name: "جاري التحميل...", role: "مدير المنصة", avatar: "👨‍🏫" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserProfile().then(profile => {
      if (!profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
        router.push('/login');
      } else {
        setAdmin({
          name: profile.full_name || "المعلم",
          role: "مدير المنصة",
          avatar: "👨‍🏫"
        });
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)" }}>
        <div style={{ width: 40, height: 40, border: "4px solid var(--primary-100)", borderTop: "4px solid var(--primary-500)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--primary-900)" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--primary-700)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0, border: "2px solid var(--primary-500)" }}>
          {admin.avatar}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {admin.name}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--primary-200)" }}>
            {admin.role}
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="mob-menu-close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary-200)", display: "flex", padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      <nav style={{ flex: 1, padding: "1.5rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", marginBottom: "0.5rem", paddingInlineStart: "0.75rem" }}>القائمة الرئيسية</div>
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem 0.9rem",
                borderRadius: "var(--radius-md)", background: isActive ? "var(--primary-50)" : "transparent",
                color: isActive ? "var(--primary-600)" : "var(--color-text)", fontWeight: isActive ? 700 : 500,
                fontSize: "0.9rem", transition: "all var(--transition-fast)",
                borderInlineStart: isActive ? "3px solid var(--primary-500)" : "3px solid transparent",
              }}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "1.25rem 0.75rem", borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <button onClick={() => logout()} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem 0.9rem", borderRadius: "var(--radius-md)", color: "#ef4444", fontWeight: 600, fontSize: "0.9rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", cursor: "pointer", width: "100%", textAlign: "right" }}>
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-bg)", display: "flex" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40, backdropFilter: "blur(2px)" }} />
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ position: "fixed", top: 0, insetInlineEnd: 0, height: "100dvh", width: 260, background: "var(--color-surface)", borderInlineStart: "1px solid var(--color-border)", display: "flex", flexDirection: "column", zIndex: 50, transition: "transform var(--transition-base)", transform: sidebarOpen ? "translateX(0)" : "translateX(105%)", overflowY: "auto" }}>
        <SidebarContent />
      </aside>

      <aside className="desk-admin-sidebar" style={{ width: 260, minHeight: "100dvh", background: "var(--color-surface)", borderInlineStart: "1px solid var(--color-border)", flexDirection: "column", flexShrink: 0, display: "none" }}>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <header style={{ height: 64, background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", padding: "0 1.25rem", gap: "0.75rem", position: "sticky", top: 0, zIndex: 30, boxShadow: "var(--shadow-sm)" }}>
          <button onClick={() => setSidebarOpen(true)} className="mob-menu-open" style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", border: "1.5px solid var(--color-border)", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-text)" }}>
            <Menu size={20} />
          </button>

          <Link href="/admin" style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.1rem", color: "var(--primary-600)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.4rem" }}>👨‍🏫</span>
            <span className="hide-on-mobile">لوحة تحكم المنصة</span>
          </Link>

          <div style={{ flex: 1 }} />

          <button style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid var(--color-border)", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-text)", position: "relative" }}>
            <Bell size={18} />
            <span style={{ position: "absolute", top: 8, right: 10, width: 8, height: 8, background: "#ef4444", borderRadius: "50%", border: "2px solid var(--color-bg)" }} />
          </button>
        </header>

        <main style={{ flex: 1, padding: "1.5rem 1.25rem", maxWidth: 1200, width: "100%", margin: "0 auto" }}>
          {children}
        </main>
      </div>

      <style>{`
        .mob-menu-open { display: flex !important; }
        .mob-menu-close { display: flex !important; }
        .desk-admin-sidebar { display: none !important; }
        .hide-on-mobile { display: none; }
        
        @media (min-width: 900px) {
          .mob-menu-open { display: none !important; }
          .mob-menu-close { display: none !important; }
          .desk-admin-sidebar { display: flex !important; }
          .admin-sidebar { display: none !important; }
          .hide-on-mobile { display: block; }
        }
      `}</style>
    </div>
  );
}
