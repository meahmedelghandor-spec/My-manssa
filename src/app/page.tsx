"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getRecentCourses } from "@/app/actions/courses";
import {
  Video,
  FileText,
  AlertTriangle,
  Lightbulb,
  MessageCircle,
  Headphones,
  BookOpen,
  Trophy,
  ChevronDown,
  Play,
  Users,
  Star,
  Clock,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const topStudents2026 = [
  { name: "حسناء عمرو سعد أحمد", rank: "المركز الأول علمي رياضة", batch: "دفعة 2026", score: "99.84%", rankNum: 1 },
  { name: "سمية موسى ابراهيم عبدالرحيم", rank: "المركز السابع علمي علوم", batch: "دفعة 2026", score: "99.69%", rankNum: 7 },
  { name: "محمد سامح محمد فتحي", rank: "المركز الثامن علمي علوم", batch: "دفعة 2026", score: "99.69%", rankNum: 8 },
  { name: "زياد ياسر صلاح جمعة", rank: "المركز السابع علمي رياضة", batch: "دفعة 2026", score: "99.53%", rankNum: 7 },
];

const topStudents2025 = [
  { name: "حسن محمد عبدالله بيومي", rank: "المركز السادس على الجمهورية", batch: "دفعة 2025", score: "318.5", rankNum: 6 },
  { name: "نوران نبيل الحسيني", rank: "المركز السادس على الجمهورية", batch: "دفعة 2025", score: "316", rankNum: 6 },
  { name: "مي أحمد عبدالله", rank: "المركز السادس أزهر", batch: "دفعة 2025", score: "99.38%", rankNum: 6 },
];

const features = [
  {
    icon: Video,
    title: "محتوى علمي متكامل",
    desc: "كل حاجة محتاجاها في مكان واحد",
    color: "#6366f1",
    bg: "#eef2ff",
    items: ["امتحان تراكمي على السابقة", "جزء الشرح (1)", "اختبار على جزء الشرح (1)", "جزء الشرح (2)", "اختبار على جزء الشرح (2)", "حل الواجب مع المستر", "امتحان نهائي على المحاضرة كاملة"],
  },
  {
    icon: FileText,
    title: "امتحانات واختبارات",
    desc: "واختبارات داخل كل محاضرة",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    items: [],
  },
  {
    icon: AlertTriangle,
    title: "أخطائي",
    desc: "تقدر تعرف الاخطاء اللي غلطها في الامتحانات طول السنة",
    color: "#ef4444",
    bg: "#fef2f2",
    items: ["السؤال الثالث - الفصل الأول", "السؤال الخامس - الفصل الثاني", "السؤال الثامن - الفصل الثالث"],
  },
  {
    icon: Play,
    title: "فيديوهات حل الواجب",
    desc: "تقدر تختار السؤال وتشوف حله من غير ما تضيع وقتك",
    color: "#10b981",
    bg: "#f0fdf4",
    items: [],
  },
  {
    icon: Lightbulb,
    title: "دعم علمي",
    desc: "لو عندك أي سؤال جه في بالك وانت بتذاكر",
    color: "#f59e0b",
    bg: "#fffbeb",
    items: [],
  },
  {
    icon: Headphones,
    title: "دعم فني فوري",
    desc: "هيرد عليك فوراً لو أي مشكلة قابلتها",
    color: "#06b6d4",
    bg: "#ecfeff",
    items: [],
  },
];

const faqs = [
  {
    q: "منصة مين اللي بتدرس لهم؟",
    a: "المنصة بتدرس لطلاب الثانوية العامة (الصف الأول والثاني والثالث الثانوي) في مادة الفيزياء.",
  },
  {
    q: "إيه الفرق بين المنصة دي وغيرها؟",
    a: "المنصة بتقدم محتوى متكامل: شرح + اختبار بعد كل جزء + حل الواجب بالفيديو + متابعة أخطائك + دعم علمي وفني على مدار الساعة.",
  },
  {
    q: "ازاي أشترك في المنصة؟",
    a: "بتعمل حساب جديد، بتختار باقتك، وبتدفع. وبعدين بيفتحلك المحتوى فوراً.",
  },
  {
    q: "فيه كورس تأسيسي مجاني؟",
    a: "أيوه! فيه كورس تأسيسي مجاني كامل هينزل قريباً. اشترك دلوقتي عشان تبقى أول واحد يوصله.",
  },
  {
    q: "الباقات بتشمل إيه؟",
    a: "كل باقة بتشمل: محاضرات الفيديو + الاختبارات + حل الواجب بالفيديو + متابعة أخطائك + الدعم الفني والعلمي.",
  },
];

const packages = [
  {
    id: "monthly",
    name: "شهري",
    label: "باقات شهرية",
    color: "#6366f1",
    available: false,
  },
  {
    id: "3months",
    name: "3 شهور",
    label: "باقات 3 شهور",
    badge: "الأوفر / الأكثر اختياراً",
    color: "#6366f1",
    available: false,
  },
  {
    id: "special",
    name: "خاصة",
    label: "باقات خاصة",
    color: "#6366f1",
    available: false,
  },
];

// ── Countdown Timer ───────────────────────────────────────────────────────────
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: "يوم" },
    { value: timeLeft.hours, label: "ساعة" },
    { value: timeLeft.minutes, label: "دقيقة" },
    { value: timeLeft.seconds, label: "ثانية" },
  ];

  return (
    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
      {units.map((u) => (
        <div
          key={u.label}
          style={{
            width: 90,
            height: 90,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "2rem",
              color: "var(--primary-500)",
              lineHeight: 1,
              animation: "countdown 0.5s ease",
            }}
          >
            {String(u.value).padStart(2, "0")}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        transition: "all var(--transition-base)",
        background: "var(--color-surface)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.1rem 1.25rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "0.9375rem",
          color: "var(--color-heading)",
          textAlign: "start",
          gap: "0.75rem",
        }}
      >
        <span>{q}</span>
        <ChevronDown
          size={18}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform var(--transition-fast)",
            flexShrink: 0,
            color: "var(--primary-500)",
          }}
        />
      </button>
      {open && (
        <div
          style={{
            padding: "0 1.25rem 1.1rem",
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
            lineHeight: 1.75,
            borderTop: "1px solid var(--color-border)",
            paddingTop: "1rem",
            animation: "fadeInUp 0.2s ease",
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

// ── Student Card ──────────────────────────────────────────────────────────────
function StudentCard({ student }: { student: typeof topStudents2026[0] }) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        textAlign: "center",
        transition: "all var(--transition-base)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xl)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-300)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
      }}
    >
      {/* Rank badge */}
      <div
        style={{
          position: "absolute",
          top: "0.75rem",
          insetInlineStart: "0.75rem",
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: "1rem",
          color: "#fff",
          boxShadow: "0 2px 8px rgba(245,158,11,0.4)",
        }}
      >
        {student.rankNum}
      </div>

      {/* Avatar */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary-100), var(--primary-200))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1rem",
          border: "3px solid var(--primary-200)",
          fontSize: "2rem",
        }}
      >
        🎓
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "0.95rem",
          color: "var(--color-heading)",
          marginBottom: "0.4rem",
        }}
      >
        {student.name}
      </div>

      <div
        style={{
          display: "inline-block",
          padding: "0.25rem 0.75rem",
          borderRadius: "var(--radius-full)",
          background: "var(--primary-50)",
          color: "var(--primary-700)",
          fontSize: "0.78rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          border: "1px solid var(--primary-200)",
        }}
      >
        {student.rank}
      </div>

      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
        {student.batch}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePackageTab, setActivePackageTab] = useState("3months");
  const [studentsTab, setStudentsTab] = useState<"2026" | "2025">("2026");
  const [recentCourses, setRecentCourses] = useState<any[]>([]);

  useEffect(() => {
    getRecentCourses().then(data => setRecentCourses(data));
  }, []);

  const toggleDark = () => {
    setDarkMode((d) => {
      document.documentElement.setAttribute("data-theme", !d ? "dark" : "light");
      return !d;
    });
  };

  // Countdown to 8-8-2026
  const targetDate = new Date("2026-08-08T00:00:00");

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Navbar darkMode={darkMode} toggleDark={toggleDark} />

      <main style={{ flex: 1, paddingTop: "var(--navbar-h)" }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          style={{
            minHeight: "calc(100dvh - var(--navbar-h))",
            display: "flex",
            alignItems: "center",
            background: "var(--color-bg)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              insetInlineEnd: "-5%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              insetInlineStart: "-5%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div className="container" style={{ padding: "3rem 1.25rem" }}>
            <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto", animation: "fadeInUp 0.6s ease both" }}>

              {/* Welcome badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 1rem",
                  borderRadius: "var(--radius-full)",
                  background: "var(--primary-50)",
                  border: "1px solid var(--primary-200)",
                  color: "var(--primary-700)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  marginBottom: "1.5rem",
                }}
              >
                🎓 دفعة 2027
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(2rem, 6vw, 3rem)",
                  color: "var(--color-heading)",
                  lineHeight: 1.3,
                  marginBottom: "1rem",
                }}
              >
                أهلًا بيكم منورين المنصة
                <span style={{ color: "var(--primary-500)" }}>!</span>
              </h1>

              {/* Description */}
              <p
                style={{
                  fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.8,
                  marginBottom: "1rem",
                }}
              >
                مع الأستاذ{" "}
                <strong style={{ color: "var(--color-heading)" }}>احمد الغندور</strong>
                . خبرة تتجاوز{" "}
                <strong style={{ color: "var(--primary-500)" }}>27 سنة</strong>{" "}
                في تدريس الفيزياء للثانوية العامة، والاف الطلاب حققوا التفوق والدرجات النهائية.
              </p>

              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.8,
                  marginBottom: "2.5rem",
                }}
              >
                هتتعلم الفيزياء بأسلوب بسيط وعملي، مع شرح احترافي، وتجارب تعليمية حديثة، وتدريب شامل على أحدث أنماط الأسئلة، علشان تدخل الامتحان وأنت جاهز تحقق أفضل نتيجة.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/register" className="btn btn-primary btn-lg">
                  👤 إنشاء حساب
                </Link>
                <Link href="/login" className="btn btn-ghost btn-lg">
                  تسجيل الدخول
                </Link>
              </div>
            </div>

            {/* Teacher image placeholder */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "3rem",
                animation: "float 4s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "6rem",
                  border: "4px solid var(--primary-200)",
                  boxShadow: "0 20px 60px rgba(99,102,241,0.2)",
                  position: "relative",
                }}
              >
                👨‍🏫
                {/* Physics badge */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 10,
                    insetInlineEnd: -10,
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    boxShadow: "var(--shadow-lg)",
                    border: "3px solid #fff",
                  }}
                >
                  ⚛️
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TOP STUDENTS ────────────────────────────────────────────────── */}
        <section className="section" style={{ background: "var(--color-surface)" }}>
          <div className="container">
            {/* Tabs */}
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  gap: "0.5rem",
                  background: "var(--color-bg)",
                  padding: "0.35rem",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--color-border)",
                  marginBottom: "2rem",
                }}
              >
                {[
                  { id: "2026", label: "🏆 أوائل 2026" },
                  { id: "2025", label: "🥇 أوائل 2025" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStudentsTab(tab.id as "2026" | "2025")}
                    style={{
                      padding: "0.5rem 1.25rem",
                      borderRadius: "var(--radius-full)",
                      border: "none",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                      background: studentsTab === tab.id ? "var(--primary-500)" : "transparent",
                      color: studentsTab === tab.id ? "#fff" : "var(--color-text-muted)",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <h2 className="section-title" style={{ marginBottom: "0.75rem" }}>
                أوائل الجمهورية {studentsTab}
              </h2>
              <p className="section-subtitle">
                طلابنا اللي حققوا أعلى الدرجات على مستوى الجمهورية
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {(studentsTab === "2026" ? topStudents2026 : topStudents2025).map((s) => (
                <StudentCard key={s.name} student={s} />
              ))}
            </div>
          </div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────────────────────────────── */}
        <section
          className="section"
          style={{
            background: "linear-gradient(135deg, var(--primary-50) 0%, var(--color-bg) 100%)",
          }}
        >
          <div className="container" style={{ textAlign: "center" }}>
            <h2
              className="section-title"
              style={{ marginBottom: "0.5rem" }}
            >
              أستنوا الكورس التأسيسي هيكون متاح يوم{" "}
              <span style={{ color: "#ef4444" }}>السبت 8-8</span>-2026
            </h2>
            <p className="section-subtitle" style={{ marginBottom: "2.5rem" }}>
              اشترك دلوقتي وكن أول واحد يوصله مجاناً!
            </p>

            <CountdownTimer targetDate={targetDate} />

            <div style={{ marginTop: "2.5rem" }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                خد الخطوة وابدأ دلوقتي — مجاناً ✨
              </Link>
            </div>
          </div>
        </section>

        {/* ── LATEST COURSES ─────────────────────────────────────────────────── */}
        <section className="section" style={{ background: "var(--color-surface)" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 className="section-title" style={{ marginBottom: "0.5rem", textAlign: "right" }}>
                  أحدث الكورسات
                </h2>
                <p className="section-subtitle" style={{ textAlign: "right", margin: 0 }}>
                  ابدأ رحلة التفوق مع أحدث كورساتنا المتاحة
                </p>
              </div>
              <Link href="/register" className="btn btn-outline" style={{ borderRadius: "var(--radius-full)" }}>
                عرض كل الكورسات
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {recentCourses.length === 0 ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--color-text-muted)", background: "var(--color-bg)", borderRadius: "var(--radius-xl)", border: "1px dashed var(--color-border-strong)" }}>
                  لا توجد كورسات متاحة حالياً. سيتم إضافة الكورسات قريباً.
                </div>
              ) : (
                recentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform var(--transition-base), box-shadow var(--transition-base)",
                      cursor: "pointer",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-xl)",
                      overflow: "hidden"
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-300)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                    }}
                  >
                    {course.image_url ? (
                      <div style={{ width: '100%', height: 180, backgroundImage: `url(${course.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--color-border)' }} />
                    ) : (
                      <div style={{ width: '100%', height: 180, background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: '3rem' }}>📚</span>
                      </div>
                    )}
                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                        <span style={{ background: "var(--primary-50)", color: "var(--primary-600)", padding: "0.25rem 0.75rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700 }}>
                          {course.grade === 'prep_1' ? 'أولى إعدادي' : course.grade === 'prep_2' ? 'ثانية إعدادي' : course.grade === 'prep_3' ? 'ثالثة إعدادي' : course.grade === 'sec_1' ? 'أولى ثانوي' : course.grade === 'sec_2' ? 'ثانية ثانوي' : 'ثالثة ثانوي'}
                        </span>
                        <span style={{ background: course.section === 'languages' ? '#fdf4ff' : '#ecfdf5', color: course.section === 'languages' ? '#c026d3' : '#059669', padding: "0.25rem 0.75rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700 }}>
                          {course.section === 'languages' ? 'لغات' : 'عربي'}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "1.2rem",
                          color: "var(--color-heading)",
                          marginBottom: "0.5rem",
                          lineHeight: 1.4
                        }}
                      >
                        {course.title}
                      </h3>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", flex: 1, marginBottom: "1.5rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {course.description || "لا يوجد وصف لهذا الكورس."}
                      </p>
                      <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 800, color: "var(--primary-600)", fontSize: "1.1rem" }}>اشترك الآن</span>
                        <Link href="/register" className="btn btn-primary" style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-full)", fontSize: "0.85rem" }}>
                          التفاصيل
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────────── */}
        <section className="section" style={{ background: "var(--color-bg)" }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>
              فحتوى علمي متكامل
            </h2>
            <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
              كل حاجة محتاجاها في مكان واحد
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {features.map((feature) => (
                <div
                  key={feature.title}
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                    transition: "all var(--transition-base)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xl)";
                    (e.currentTarget as HTMLElement).style.borderColor = feature.color + "60";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "var(--radius-md)",
                      background: feature.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <feature.icon size={24} color={feature.color} />
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: "var(--color-heading)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginBottom: feature.items.length > 0 ? "1rem" : 0 }}>
                    {feature.desc}
                  </p>

                  {feature.items.length > 0 && (
                    <div
                      style={{
                        background: "var(--color-bg)",
                        borderRadius: "var(--radius-md)",
                        padding: "0.75rem 1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.35rem",
                      }}
                    >
                      {feature.items.map((item) => (
                        <div
                          key={item}
                          style={{
                            fontSize: "0.8rem",
                            color: item.includes("اختبار") || item.includes("امتحان") ? feature.color : "var(--color-text-muted)",
                            fontWeight: item.includes("اختبار") || item.includes("امتحان") ? 700 : 400,
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PACKAGES ─────────────────────────────────────────────────────── */}
        <section
          className="section"
          style={{
            background: "linear-gradient(135deg, #eef2ff 0%, var(--color-bg) 100%)",
          }}
        >
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>
              الباقات والعروض
            </h2>
            <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
              اختار الباقة اللي تناسبك
            </p>

            {/* Package tabs */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setActivePackageTab(pkg.id)}
                  style={{
                    position: "relative",
                    padding: "0.6rem 1.5rem",
                    borderRadius: "var(--radius-full)",
                    border: activePackageTab === pkg.id ? "2px solid var(--primary-500)" : "1.5px solid var(--color-border)",
                    background: activePackageTab === pkg.id ? "var(--primary-50)" : "var(--color-surface)",
                    color: activePackageTab === pkg.id ? "var(--primary-700)" : "var(--color-text)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {pkg.id === "3months" && (
                    <span
                      style={{
                        position: "absolute",
                        top: -10,
                        insetInlineStart: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--primary-500)",
                        color: "#fff",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "var(--radius-full)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      الأوفر / الأكثر اختياراً
                    </span>
                  )}
                  {pkg.label}
                </button>
              ))}
            </div>

            {/* Package content */}
            <div
              style={{
                maxWidth: 480,
                margin: "0 auto",
                background: "var(--color-surface)",
                border: "2px dashed var(--primary-300)",
                borderRadius: "var(--radius-xl)",
                padding: "3rem",
                textAlign: "center",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📦</div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "var(--color-heading)",
                  marginBottom: "0.5rem",
                }}
              >
                قريباً!
              </h3>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                الباقات هتتاح قريباً — سجل الآن عشان تكون أول واحد يعرف
              </p>
              <Link href="/register" className="btn btn-primary">
                سجل الآن مجاناً ✨
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────────────── */}
        <section className="section" style={{ background: "var(--color-surface)" }}>
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {[
                { icon: Users, value: "+2000", label: "طالب استفاد", color: "#6366f1" },
                { icon: Video, value: "+500", label: "فيديو تعليمي", color: "#10b981" },
                { icon: Star, value: "27", label: "سنة خبرة", color: "#f59e0b" },
                { icon: Trophy, value: "+100", label: "أوائل جمهورية", color: "#ef4444" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    textAlign: "center",
                    padding: "2rem 1rem",
                    background: "var(--color-bg)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: stat.color + "15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1rem",
                    }}
                  >
                    <stat.icon size={24} color={stat.color} />
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 900,
                      fontSize: "2rem",
                      color: stat.color,
                      lineHeight: 1,
                      marginBottom: "0.35rem",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", fontWeight: 600 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="section" style={{ background: "var(--color-bg)" }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>
              أسئلة شائعة
            </h2>
            <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
              الأسئلة اللي بتتسأل كتير
            </p>

            <div
              style={{
                maxWidth: 720,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
