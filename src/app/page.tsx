"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getRecentCourses } from "@/app/actions/courses";
import { getLandingSettings } from "@/app/actions/landing";
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
        border: open ? "1px solid var(--primary-300)" : "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        transition: "all var(--transition-base)",
        background: open ? "var(--color-surface)" : "rgba(255, 255, 255, 0.4)",
        boxShadow: open ? "0 4px 20px rgba(99,102,241,0.1)" : "none",
        marginBottom: "1rem"
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          fontWeight: 800,
          fontSize: "1rem",
          color: open ? "var(--primary-700)" : "var(--color-heading)",
          textAlign: "start",
          gap: "1rem",
          transition: "color var(--transition-fast)"
        }}
      >
        <span>{q}</span>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: open ? "var(--primary-100)" : "var(--color-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background var(--transition-fast)"
        }}>
          <ChevronDown
            size={16}
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0)",
              transition: "transform var(--transition-base)",
              color: open ? "var(--primary-600)" : "var(--color-text-muted)",
            }}
          />
        </div>
      </button>
      {open && (
        <div
          style={{
            padding: "0 1.5rem 1.5rem",
            color: "var(--color-text)",
            fontSize: "0.95rem",
            lineHeight: 1.8,
            animation: "fadeInUp 0.3s ease",
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
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        borderRadius: "var(--radius-xl)",
        padding: "1.5rem",
        textAlign: "center",
        transition: "all var(--transition-base)",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px rgba(99,102,241,0.15)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-300)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.03)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.8)";
      }}
    >
      {/* Rank badge */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          insetInlineStart: "1rem",
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: "0.9rem",
          color: "#fff",
          boxShadow: "0 2px 10px rgba(245,158,11,0.5)",
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
          background: "linear-gradient(135deg, var(--primary-100), var(--primary-300))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.25rem",
          border: "4px solid #fff",
          fontSize: "2.2rem",
          boxShadow: "0 8px 20px rgba(99,102,241,0.2)"
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
  const [activePackageTab, setActivePackageTab] = useState("3months");
  const [studentsTab, setStudentsTab] = useState<"2026" | "2025">("2026");
  const [recentCourses, setRecentCourses] = useState<any[]>([]);

  // Add state for dynamic content
  const [dynTopStudents2026, setDynTopStudents2026] = useState<any[]>(topStudents2026);
  const [dynTopStudents2025, setDynTopStudents2025] = useState<any[]>(topStudents2025);
  const [dynCountdown, setDynCountdown] = useState<any>({
    targetDate: "2026-08-08T00:00:00",
    titlePart1: "أستنوا الكورس التأسيسي هيكون متاح يوم",
    titleHighlight: "السبت 8-8",
    titlePart2: "-2026",
    subtitle: "اشترك دلوقتي وكن أول واحد يوصله مجاناً!",
    visible: true
  });
  const [dynPackages, setDynPackages] = useState<any[]>(packages);

  useEffect(() => {
    getRecentCourses().then(data => setRecentCourses(data));
    getLandingSettings().then(data => {
      if (data.top_students_2026) setDynTopStudents2026(data.top_students_2026);
      if (data.top_students_2025) setDynTopStudents2025(data.top_students_2025);
      if (data.countdown_timer) setDynCountdown(data.countdown_timer);
      if (data.packages) setDynPackages(data.packages);
    });
  }, []);

  const targetDate = new Date(dynCountdown.targetDate || "2026-08-08T00:00:00");

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: "var(--navbar-h)" }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          style={{
            minHeight: "calc(100dvh - var(--navbar-h))",
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-soft) 100%)",
            position: "relative",
            overflow: "hidden",
            padding: "4rem 0"
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: "absolute",
              top: "-10%",
              insetInlineEnd: "-10%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              insetInlineStart: "-10%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div className="container" style={{ position: "relative", zIndex: 10 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "3rem",
                alignItems: "center",
              }}
            >
              {/* Text Content */}
              <div style={{ animation: "fadeInUp 0.6s ease both" }}>
                {/* Welcome badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-surface)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-primary)",
                    fontWeight: 800,
                    fontSize: "0.875rem",
                    marginBottom: "1.5rem",
                    boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>🎓</span> الأقوى في الفيزياء لدفعة 2027
                </div>

                {/* Title */}
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    color: "var(--color-heading)",
                    lineHeight: 1.2,
                    marginBottom: "1.25rem",
                    textShadow: "0 2px 10px rgba(0,0,0,0.05)"
                  }}
                >
                  أهلاً بك في <br/>
                  <span style={{ 
                    background: "linear-gradient(90deg, var(--primary-600), var(--accent-500))", 
                    WebkitBackgroundClip: "text", 
                    WebkitTextFillColor: "transparent" 
                  }}>
                    منصة التفوق
                  </span>
                </h1>

                {/* Description */}
                <p
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    color: "var(--color-text)",
                    lineHeight: 1.8,
                    marginBottom: "1rem",
                    fontWeight: 500,
                  }}
                >
                  مع الأستاذ{" "}
                  <strong style={{ color: "var(--color-primary)", fontWeight: 800 }}>احمد الغندور</strong>
                  . خبرة تتجاوز{" "}
                  <strong style={{ color: "var(--accent-500)", fontWeight: 800 }}>5 سنوات</strong>{" "}
                  في تدريس الفيزياء للثانوية العامة، وآلاف الطلاب حققوا التفوق والدرجات النهائية.
                </p>

                <p
                  style={{
                    fontSize: "1rem",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.8,
                    marginBottom: "2.5rem",
                  }}
                >
                  هتتعلم الفيزياء بأسلوب بسيط وعملي، مع شرح احترافي، وتجارب تعليمية حديثة، وتدريب شامل على أحدث أنماط الأسئلة.
                </p>

                {/* CTA Buttons */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link href="/register" className="btn btn-primary btn-lg" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", borderRadius: "var(--radius-full)" }}>
                    🚀 ابدأ الآن مجاناً
                  </Link>
                  <Link href="/login" className="btn btn-ghost btn-lg" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", borderRadius: "var(--radius-full)", background: "var(--color-surface)", backdropFilter: "blur(10px)" }}>
                    تسجيل الدخول
                  </Link>
                </div>
              </div>

              {/* Graphic/Image */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  animation: "float 6s ease-in-out infinite",
                  position: "relative"
                }}
              >
                <div style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
                  filter: "blur(40px)",
                  zIndex: 0
                }} />
                
                <img 
                  src="/images/physics-hero.png" 
                  alt="Physics Hero Illustration" 
                  style={{ 
                    width: "100%", 
                    maxWidth: 550, 
                    position: "relative", 
                    zIndex: 1,
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))",
                    borderRadius: "2rem"
                  }} 
                />
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
              {(studentsTab === "2026" ? dynTopStudents2026 : dynTopStudents2025).map((s) => (
                <StudentCard key={s.name} student={s} />
              ))}
            </div>
          </div>
        </section>

        {/* ── COUNTDOWN ───────────────────────────────────────────────────── */}
        {dynCountdown.visible && (
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
              {dynCountdown.titlePart1}{" "}
              <span style={{ color: "#ef4444" }}>{dynCountdown.titleHighlight}</span>{dynCountdown.titlePart2}
            </h2>
            <p className="section-subtitle" style={{ marginBottom: "2.5rem" }}>
              {dynCountdown.subtitle}
            </p>

            <CountdownTimer targetDate={targetDate} />

            <div style={{ marginTop: "2.5rem" }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                خد الخطوة وابدأ دلوقتي — مجاناً ✨
              </Link>
            </div>
          </div>
        </section>
        )}

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
                  <Link 
                    key={course.id}
                    href="/register" 
                    style={{ 
                      background: "var(--color-surface)", 
                      border: "1px solid var(--color-border)", 
                      borderRadius: "var(--radius-xl)", 
                      display: "flex", 
                      flexDirection: "column", 
                      overflow: "hidden", 
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                      boxShadow: "var(--shadow-md)",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xl)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-300)";
                      const img = e.currentTarget.querySelector('.course-img') as HTMLElement;
                      if(img) img.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      const img = e.currentTarget.querySelector('.course-img') as HTMLElement;
                      if(img) img.style.transform = 'scale(1)';
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                      {course.image_url ? (
                        <div className="course-img" style={{ width: '100%', height: '100%', backgroundImage: `url(${course.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s ease' }} />
                      ) : (
                        <div className="course-img" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.5s ease' }}>
                          <BookOpen size={48} color="rgba(255,255,255,0.5)" />
                        </div>
                      )}
                      
                      {/* Gradient Overlay for Text Readability */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />

                      {/* Floating Badges */}
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', zIndex: 2 }}>
                        <span style={{ background: "rgba(255,255,255,0.9)", color: "var(--primary-700)", padding: "0.3rem 0.8rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 800, backdropFilter: "blur(4px)", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                          {course.grade === 'prep_1' ? 'أولى إعدادي' : course.grade === 'prep_2' ? 'ثانية إعدادي' : course.grade === 'prep_3' ? 'ثالثة إعدادي' : course.grade === 'sec_1' ? 'أولى ثانوي' : course.grade === 'sec_2' ? 'ثانية ثانوي' : 'ثالثة ثانوي'}
                        </span>
                        <span style={{ background: course.section === 'languages' ? 'rgba(192,38,211,0.9)' : 'rgba(5,150,105,0.9)', color: "#fff", padding: "0.3rem 0.8rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 800, backdropFilter: "blur(4px)", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                          {course.section === 'languages' ? 'لغات' : 'عربي'}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "1.2rem",
                          color: "var(--color-heading)",
                          marginBottom: "0.75rem",
                          lineHeight: 1.4
                        }}
                      >
                        {course.title}
                      </h3>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", flex: 1, marginBottom: "1.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.6 }}>
                        {course.description || "لا يوجد وصف متاح لهذا الكورس."}
                      </p>
                      
                      <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 800, color: "var(--primary-600)", fontSize: "1rem", display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          اشترك الآن <span style={{fontSize: '1.2rem'}}>✨</span>
                        </span>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)' }}>
                           <ChevronDown size={18} style={{ transform: 'rotate(90deg)' }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────────── */}
        <section className="section" style={{ background: "linear-gradient(to bottom, var(--color-surface), #f8fafc)" }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>
              محتوى علمي متكامل
            </h2>
            <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
              كل حاجة محتاجها في مكان واحد
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem",
              }}
            >
              {features.map((feature, idx) => (
                <div
                  key={feature.title}
                  style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                    borderRadius: "var(--radius-xl)",
                    padding: "2rem",
                    transition: "all var(--transition-base)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px ${feature.color}30`;
                    (e.currentTarget as HTMLElement).style.borderColor = feature.color + "50";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.03)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.8)";
                  }}
                >
                  {/* Decorative Background Blob */}
                  <div style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: 100,
                    height: 100,
                    background: `radial-gradient(circle, ${feature.color}15 0%, transparent 70%)`,
                    borderRadius: "50%",
                    zIndex: 0
                  }} />

                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "var(--radius-lg)",
                      background: feature.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                      boxShadow: `0 8px 16px ${feature.color}20`,
                      position: "relative",
                      zIndex: 1
                    }}
                  >
                    <feature.icon size={28} color={feature.color} />
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "1.2rem",
                      color: "var(--color-heading)",
                      marginBottom: "0.5rem",
                      position: "relative",
                      zIndex: 1
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: "var(--color-text)", fontSize: "0.95rem", marginBottom: feature.items.length > 0 ? "1.5rem" : 0, lineHeight: 1.7, position: "relative", zIndex: 1 }}>
                    {feature.desc}
                  </p>

                  {feature.items.length > 0 && (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.5)",
                        border: "1px solid rgba(0,0,0,0.05)",
                        borderRadius: "var(--radius-md)",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        position: "relative",
                        zIndex: 1
                      }}
                    >
                      {feature.items.map((item) => (
                        <div
                          key={item}
                          style={{
                            fontSize: "0.85rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            color: item.includes("اختبار") || item.includes("امتحان") ? feature.color : "var(--color-text)",
                            fontWeight: item.includes("اختبار") || item.includes("امتحان") ? 700 : 500,
                          }}
                        >
                          <span style={{ color: feature.color }}>✓</span> {item}
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
              {dynPackages.map((pkg: any) => (
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
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.8)",
                borderRadius: "var(--radius-xl)",
                padding: "3.5rem 2rem",
                textAlign: "center",
                animation: "fadeIn 0.5s ease",
                boxShadow: "0 10px 40px rgba(99,102,241,0.08)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: "linear-gradient(90deg, var(--primary-400), var(--accent-400))"
              }} />
              <div style={{ fontSize: "4rem", marginBottom: "1rem", animation: "float 4s ease-in-out infinite" }}>📦</div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "1.5rem",
                  color: "var(--color-heading)",
                  marginBottom: "0.5rem",
                }}
              >
                الباقات قريباً!
              </h3>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", marginBottom: "2rem", lineHeight: 1.6 }}>
                نعمل حالياً على تجهيز الباقات بأفضل الأسعار وأقوى محتوى. سجل الآن عشان تكون أول واحد يعرف.
              </p>
              <Link href="/register" className="btn btn-primary btn-lg" style={{ width: "100%", borderRadius: "var(--radius-full)" }}>
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
