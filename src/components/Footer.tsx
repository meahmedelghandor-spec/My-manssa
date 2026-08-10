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

import { useEffect, useState } from "react";

const defaultSocialLinks = [
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

const defaultSupportLinks = [
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
  
  const [dynTeacher, setDynTeacher] = useState({ name: "الأستاذ احمد الغندور", desc: "خبرة أكثر من 25 سنة في تدريس الفيزياء", email: "me.ahmedelghandor@gmail.com" });
  const [dynSocial, setDynSocial] = useState(defaultSocialLinks);
  const [dynSupport, setDynSupport] = useState(defaultSupportLinks);

  useEffect(() => {
    import("@/app/actions/landing").then(({ getLandingSettings }) => {
      getLandingSettings().then(data => {
         if (data.footer_settings) {
            if (data.footer_settings.teacher_info) {
              setDynTeacher(data.footer_settings.teacher_info);
            }
            if (data.footer_settings.socialLinks) {
              setDynSocial(prev => prev.map((link, i) => ({
                ...link,
                label: data.footer_settings.socialLinks[i]?.label || link.label,
                desc: data.footer_settings.socialLinks[i]?.desc || link.desc,
                href: data.footer_settings.socialLinks[i]?.href || link.href,
              })));
            }
            if (data.footer_settings.supportLinks) {
              setDynSupport(prev => prev.map((link, i) => ({
                ...link,
                label: data.footer_settings.supportLinks[i]?.label || link.label,
                desc: data.footer_settings.supportLinks[i]?.desc || link.desc,
                href: data.footer_settings.supportLinks[i]?.href || link.href,
                phone: data.footer_settings.supportLinks[i]?.phone || link.phone,
              })));
            }
         }
      });
    });
  }, []);

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
                {dynTeacher.name}
              </div>
            </div>
          </div>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            {dynTeacher.desc} •{" "}
            <a
              href={`mailto:${dynTeacher.email}`}
              style={{ color: "var(--primary-500)", fontWeight: 600 }}
            >
              {dynTeacher.email}
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
              {dynSocial
                .filter((s) => s.category === "فيسبوك")
                .map((link) => {
                  const cleanHref = link.href?.startsWith("#http") ? link.href.substring(1) : link.href;
                  return (
                  <a
                    key={link.label}
                    href={cleanHref}
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
                      (e.currentTarget as HTMLElement).style.background = "var(--color-bg-soft)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border-strong)";
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
                )})}
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
              {dynSocial
                .filter((s) => s.category === "فيديو وسوشيال")
                .map((link) => {
                  const cleanHref = link.href?.startsWith("#http") ? link.href.substring(1) : link.href;
                  return (
                  <a
                    key={link.label}
                    href={cleanHref}
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
                      (e.currentTarget as HTMLElement).style.background = "var(--color-bg-soft)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border-strong)";
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
                )})}
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
              {dynSupport.map((link) => {
                const cleanHref = link.href?.startsWith("#http") ? link.href.substring(1) : link.href;
                return (
                <a
                  key={link.label}
                  href={cleanHref}
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
                    (e.currentTarget as HTMLElement).style.background = "var(--color-bg-soft)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border-strong)";
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
              )})}
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
