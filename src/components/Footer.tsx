"use client";

import Link from "next/link";
import {
  Tv2 as Youtube,
  ExternalLink as Facebook,
  MessageCircle,
  Camera as Instagram,
  Send,
  Phone,
} from "lucide-react";

const socialLinks = [
  {
    icon: Facebook,
    label: "الصفحة الرسمية",
    desc: "أي أخبار تفاصيل، معلومات مهمة هتبلغكم هناك",
    href: "#",
    color: "#1877f2",
    bg: "#f0f4ff",
    category: "فيسبوك",
  },
  {
    icon: MessageCircle,
    label: "جروب الطلاب",
    desc: "لو عندك أي استفسار علمي",
    href: "#",
    color: "#1877f2",
    bg: "#f0f4ff",
    category: "فيسبوك",
  },
  {
    icon: MessageCircle,
    label: "جروب الاستراحة",
    desc: "نفك شوية عن نفسنا من دوشة الفيزياء",
    href: "#",
    color: "#1877f2",
    bg: "#f0f4ff",
    category: "فيسبوك",
  },
  {
    icon: Youtube,
    label: "يوتيوب",
    desc: "أي كورس أو محاضرة مجانية أو فيديو توضيحي هينزل هناك",
    href: "#",
    color: "#ff0000",
    bg: "#fff0f0",
    category: "فيديو وسوشيال",
  },
  {
    icon: Instagram,
    label: "إنستجرام",
    desc: "أخر التنبيهات والأخبار وصور محاضراتنا",
    href: "#",
    color: "#e1306c",
    bg: "#fff0f5",
    category: "فيديو وسوشيال",
  },
];

const supportLinks = [
  {
    icon: Phone,
    label: "قناة واتساب",
    desc: "أي أخبار أو تنبيهات أو معلومات هتنزل هناك",
    href: "#",
    color: "#25d366",
    bg: "#f0fdf4",
  },
  {
    icon: Send,
    label: "دعم فني – تيليجرام",
    desc: "عندك مشكلة على المنصة؟ متقلقش هنساعدك فوراً",
    href: "#",
    color: "#2aabee",
    bg: "#f0f9ff",
  },
  {
    icon: Phone,
    label: "دعم نفسي – واتساب",
    desc: "تحديد أفضل طرق المذاكرة وتنظيم الوقت",
    href: "#",
    color: "#25d366",
    bg: "#f0fdf4",
    phone: "01507200326",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        paddingTop: "3rem",
        paddingBottom: "2rem",
      }}
    >
      <div className="container">
        {/* Teacher info */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>👨‍🏫</span>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "var(--color-heading)",
                }}
              >
                الأستاذ احمد الغندور
              </div>
            </div>
          </div>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            خبرة أكثر من 25 سنة في تدريس الفيزياء •{" "}
            <a
              href="https://abdelmaaboud.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary-500)", fontWeight: 600 }}
            >
              abdelmaaboud.com
            </a>
          </p>
        </div>

        {/* Social Links */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Facebook */}
          <div>
            <h4
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <Facebook size={14} /> فيسبوك
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {socialLinks
                .filter((s) => s.category === "فيسبوك")
                .map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg)",
                      transition: "all var(--transition-fast)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = link.bg;
                      (e.currentTarget as HTMLElement).style.borderColor = link.color + "40";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--color-bg)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "var(--radius-md)",
                        background: link.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <link.icon size={18} color={link.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-heading)" }}>
                        {link.label}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                        {link.desc}
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>

          {/* Video & Social */}
          <div>
            <h4
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <Youtube size={14} /> فيديو وسوشيال
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {socialLinks
                .filter((s) => s.category === "فيديو وسوشيال")
                .map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg)",
                      transition: "all var(--transition-fast)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = link.bg;
                      (e.currentTarget as HTMLElement).style.borderColor = link.color + "40";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--color-bg)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "var(--radius-md)",
                        background: link.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <link.icon size={18} color={link.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-heading)" }}>
                        {link.label}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                        {link.desc}
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <Phone size={14} /> الدعم والتواصل
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {supportLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg)",
                    transition: "all var(--transition-fast)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = link.bg;
                    (e.currentTarget as HTMLElement).style.borderColor = link.color + "40";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--color-bg)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-md)",
                      background: link.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <link.icon size={18} color={link.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-heading)" }}>
                      {link.label}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                      {link.desc}
                    </div>
                    {"phone" in link && link.phone && (
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: link.color, marginTop: "0.15rem" }}>
                        {link.phone}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "1.25rem",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontSize: "0.825rem",
          }}
        >
          © {year} منصة مستر احمد الغندور — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
