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
        paddingTop: "2.5rem",
        paddingBottom: "1.5rem",
      }}
    >
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          
          {/* Teacher Info */}
          <div style={{ flex: '1 1 250px', maxWidth: '350px' }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.2rem" }}>👨‍🏫</span>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--color-heading)" }}>
                {dynTeacher.name}
              </div>
            </div>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: '0.75rem' }}>
              {dynTeacher.desc}
            </p>
            <a href={`mailto:${dynTeacher.email}`} style={{ color: "var(--primary-600)", fontSize: "0.85rem", fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
              <MessageCircle size={14} />
              {dynTeacher.email}
            </a>
          </div>

          {/* Social Links Group */}
          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "1rem" }}>
              تواصل معنا
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {dynSocial.map((link, idx) => {
                const cleanHref = link.href?.startsWith("#http") ? link.href.substring(1) : link.href;
                return (
                  <a key={idx} href={cleanHref} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.85rem", transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => (e.currentTarget.style.color = link.color)} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}>
                    <link.icon size={16} />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Support Links Group */}
          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-heading)", marginBottom: "1rem" }}>
              الدعم الفني
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {dynSupport.map((link, idx) => {
                const cleanHref = link.href?.startsWith("#http") ? link.href.substring(1) : link.href;
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <a href={cleanHref} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.85rem", transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => (e.currentTarget.style.color = link.color)} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}>
                      <link.icon size={16} />
                      <span>{link.label}</span>
                    </a>
                    {"phone" in link && link.phone && (
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", paddingInlineStart: "1.5rem" }}>
                        {link.phone}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.25rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
          © {year} منصة مستر احمد الغندور — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
