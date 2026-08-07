"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, ArrowRight, KeyRound, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
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
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary-100), var(--primary-200))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.2rem",
            margin: "0 auto 1rem",
            border: "3px solid var(--primary-200)",
          }}
        >
          👨‍🏫
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "1.3rem",
            color: "var(--color-heading)",
          }}
        >
          منصة مستر احمد الغندور
        </h1>
      </div>

      {/* Card */}
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-xl)",
          padding: "2rem",
          width: "100%",
          maxWidth: 420,
          animation: "scaleIn 0.3s ease",
        }}
      >
        {!sent ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--primary-50)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <KeyRound size={24} color="var(--primary-500)" />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  color: "var(--color-heading)",
                  marginBottom: "0.4rem",
                }}
              >
                نسيت كلمة المرور؟
              </h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", lineHeight: 1.7 }}>
                أدخل رقم تليفونك وهنبعتلك كود التحقق
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <Phone size={14} color="var(--primary-500)" />
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="form-input"
                  placeholder="01xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  dir="ltr"
                  style={{ textAlign: "right" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.85rem", justifyContent: "center" }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        border: "2.5px solid rgba(255,255,255,0.4)",
                        borderTop: "2.5px solid #fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    جاري الإرسال...
                  </span>
                ) : (
                  "إرسال كود التحقق"
                )}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "1rem", animation: "scaleIn 0.3s ease" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <CheckCircle size={36} color="#16a34a" />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.3rem",
                color: "var(--color-heading)",
                marginBottom: "0.5rem",
              }}
            >
              تم إرسال الكود! ✉️
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              تم إرسال كود التحقق على الرقم{" "}
              <strong style={{ color: "var(--color-heading)" }}>{phone}</strong>
            </p>
            <Link href="/login" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              العودة لتسجيل الدخول
            </Link>
          </div>
        )}
      </div>

      {/* Back link */}
      <div style={{ marginTop: "1.5rem" }}>
        <Link
          href="/login"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            color: "var(--color-text-muted)",
            fontSize: "0.875rem",
          }}
        >
          <ArrowRight size={14} />
          العودة لتسجيل الدخول
        </Link>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
