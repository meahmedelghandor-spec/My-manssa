"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        insetInline: 0,
        zIndex: 100,
        height: "var(--navbar-h)",
        background: scrolled
          ? "var(--navbar-bg, rgba(255,255,255,0.95))"
          : "var(--navbar-bg-transparent, rgba(255,255,255,0.85))",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: scrolled ? "var(--shadow-md)" : "none",
        transition: "all var(--transition-base)",
      }}
    >
      <div
        className="container"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              border: "2px solid var(--primary-200)",
              background: "var(--primary-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            👨‍🏫
          </div>
          <div style={{ lineHeight: 1.25 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "0.95rem",
                color: "var(--color-heading)",
              }}
            >
              مستر <span style={{ color: "var(--primary-500)" }}>احمد الغندور</span>
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
              منصة الفيزياء للثانوية العامة
            </div>
          </div>
        </Link>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Login */}
          <Link
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 1rem",
              borderRadius: "var(--radius-full)",
              border: "1.5px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text)",
              fontWeight: 600,
              fontSize: "0.875rem",
              transition: "all var(--transition-fast)",
            }}
          >
            <LogIn size={15} />
            تسجيل الدخول
          </Link>

          {/* Register */}
          <Link
            href="/register"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.5rem 1.1rem",
              borderRadius: "var(--radius-full)",
              background: "var(--primary-500)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              boxShadow: "var(--shadow-primary)",
              transition: "all var(--transition-fast)",
            }}
          >
            <UserPlus size={15} />
            إنشاء حساب
          </Link>
        </div>
      </div>
    </header>
  );
}
