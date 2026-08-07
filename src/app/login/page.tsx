"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn, ArrowRight, Phone, Lock } from "lucide-react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await login(formData);
      if (res?.error) {
        setErrorMsg(res.error);
      }
    });
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          insetInlineStart: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse at top right, rgba(99,102,241,0.07) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary-100), var(--primary-200))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              margin: "0 auto 1rem",
              border: "3px solid var(--primary-200)",
              boxShadow: "0 8px 24px rgba(99,102,241,0.15)",
            }}
          >
            👨‍🏫
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.4rem", color: "var(--color-heading)", marginBottom: "0.25rem" }}>
            منصة مستر أحمد الغندور
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            سجل دخولك للوصول لحسابك
          </p>
        </div>

        <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-xl)", padding: "2rem", animation: "scaleIn 0.3s ease" }}>
          <div style={{ marginBottom: "1.75rem" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-heading)", marginBottom: "0.3rem" }}>
              <LogIn size={20} color="var(--primary-500)" />
              تسجيل الدخول
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
              أدخل رقم التليفون وكلمة السر
            </p>
          </div>

          {errorMsg && (
            <div style={{ background: "#fef2f2", color: "#ef4444", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1rem", fontSize: "0.85rem", border: "1px solid #fecaca" }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="form-group">
              <label className="form-label"><Phone size={13} /> رقم التليفون</label>
              <input type="tel" name="phone" className="form-input" placeholder="01xxxxxxxxx" required dir="ltr" style={{ textAlign: "right" }} />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
                <span><Lock size={13} /> كلمة المرور</span>
                <Link href="/forgot-password" style={{ color: "var(--primary-600)", fontSize: "0.75rem", fontWeight: 700 }}>نسيت كلمة المرور؟</Link>
              </label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} name="password" className="form-input" placeholder="••••••••" required dir="ltr" style={{ textAlign: "right" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", top: "50%", insetInlineStart: "1rem", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", display: "flex" }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isPending} className="btn btn-primary" style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem", justifyContent: "center" }}>
              {isPending ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  جاري تسجيل الدخول...
                </span>
              ) : (
                <>تسجيل الدخول <ArrowRight size={18} style={{ transform: "rotate(180deg)" }} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            ليس لديك حساب؟{" "}
            <Link href="/register" style={{ color: "var(--primary-600)", fontWeight: 700 }}>إنشاء حساب جديد</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
