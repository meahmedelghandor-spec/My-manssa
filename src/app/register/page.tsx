"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, User, Phone, Shield, Check, Lock, BookOpen } from "lucide-react";
import { signup } from "@/app/actions/auth";

type Step = 1 | 2 | 3;

const GRADES = [
  { id: "prep_1", label: "الصف الأول الإعدادي" },
  { id: "prep_2", label: "الصف الثاني الإعدادي" },
  { id: "prep_3", label: "الصف الثالث الإعدادي" },
  { id: "sec_1", label: "الصف الأول الثانوي" },
  { id: "sec_2", label: "الصف الثاني الثانوي" },
  { id: "sec_3", label: "الصف الثالث الثانوي" },
];

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  
  // Step 1
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState(""); // "arabic" | "languages"
  
  // Step 2
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((s) => Math.min(s + 1, 3) as Step);
  };

  const goPrev = () => setStep((s) => Math.max(s - 1, 1) as Step);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("fullName", fullName);
    formData.append("grade", grade);
    formData.append("section", section);

    startTransition(async () => {
      const res = await signup(formData);
      if (res?.error) {
        setErrorMsg(res.error);
        setStep(2); // Go back if error
      }
    });
  };

  const steps = [
    { num: 1, label: "بيانات الطالب", icon: User },
    { num: 2, label: "حساب الدخول", icon: Phone },
    { num: 3, label: "التحقق", icon: Shield },
  ];

  const getGradeLabel = (gId: string) => GRADES.find(g => g.id === gId)?.label || gId;
  const getSectionLabel = (sId: string) => sId === 'arabic' ? 'عربي' : 'لغات';

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary-100), var(--primary-200))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 0.75rem", border: "3px solid var(--primary-200)" }}>
          👨‍🏫
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.2rem", color: "var(--color-heading)", marginBottom: "0.15rem" }}>
          منصة مستر أحمد الغندور
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>إنشاء حساب جديد</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", width: "100%", maxWidth: 480 }}>
        {steps.map((s, i) => (
          <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "unset" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: step >= s.num ? "var(--primary-500)" : "var(--color-border)", color: step >= s.num ? "#fff" : "var(--color-text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.875rem", transition: "all 0.3s" }}>
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              <span style={{ fontSize: "0.7rem", color: step >= s.num ? "var(--primary-600)" : "var(--color-text-muted)", fontWeight: step >= s.num ? 700 : 400 }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: step > s.num ? "var(--primary-500)" : "var(--color-border)", margin: "0 0.5rem", marginTop: "-1.2rem", transition: "all 0.3s" }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: 480, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", padding: "2rem", boxShadow: "var(--shadow-md)" }}>
        
        {errorMsg && (
          <div style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fca5a5", padding: "1rem", borderRadius: "var(--radius-md)", fontSize: "0.85rem", marginBottom: "1.5rem", textAlign: "center" }}>
            {errorMsg}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={goNext} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", color: "var(--color-heading)", marginBottom: "0.25rem" }}>
              <User size={20} color="var(--primary-500)" />
              بيانات الطالب
            </h2>
            
            <div className="form-group">
              <label className="form-label"><User size={13} /> الاسم الرباعي *</label>
              <input type="text" className="form-input" placeholder="اكتب اسمك ثلاثي أو رباعي" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label"><BookOpen size={13} /> السنة الدراسية *</label>
              <select className="form-input" value={grade} onChange={(e) => setGrade(e.target.value)} required>
                <option value="">اختر السنة الدراسية</option>
                {GRADES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label"><BookOpen size={13} /> قسم الدراسة *</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", border: section === 'arabic' ? "2px solid var(--primary-500)" : "1px solid var(--color-border)", borderRadius: "var(--radius-md)", cursor: "pointer", background: section === 'arabic' ? "var(--primary-50)" : "var(--color-bg)" }}>
                  <input type="radio" name="section" value="arabic" checked={section === 'arabic'} onChange={(e) => setSection(e.target.value)} required style={{ accentColor: "var(--primary-500)" }} />
                  <span style={{ fontWeight: 600 }}>عربي</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", border: section === 'languages' ? "2px solid var(--primary-500)" : "1px solid var(--color-border)", borderRadius: "var(--radius-md)", cursor: "pointer", background: section === 'languages' ? "var(--primary-50)" : "var(--color-bg)" }}>
                  <input type="radio" name="section" value="languages" checked={section === 'languages'} onChange={(e) => setSection(e.target.value)} required style={{ accentColor: "var(--primary-500)" }} />
                  <span style={{ fontWeight: 600 }}>لغات</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.85rem", justifyContent: "center", marginTop: "1rem" }}>
              <ArrowLeft size={18} /> التالى
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form onSubmit={goNext} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", color: "var(--color-heading)", marginBottom: "0.25rem" }}>
              <Phone size={20} color="var(--primary-500)" />
              حساب الدخول
            </h2>

            <div className="form-group">
              <label className="form-label"><Phone size={13} /> رقم التليفون *</label>
              <input type="tel" className="form-input" placeholder="01xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} required dir="ltr" style={{ textAlign: "right" }} minLength={11} maxLength={11} />
            </div>

            <div className="form-group">
              <label className="form-label"><Lock size={13} /> كلمة المرور *</label>
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" style={{ textAlign: "right" }} minLength={6} />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button type="button" onClick={goPrev} className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }}><ArrowRight size={18} /> السابق</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "0.85rem", justifyContent: "center" }}><ArrowLeft size={18} /> التالى</button>
            </div>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem", alignItems: "center" }}>
            <Shield size={48} color="var(--primary-500)" style={{ marginBottom: "0.5rem" }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", color: "var(--color-heading)", textAlign: "center" }}>
              تأكيد البيانات
            </h2>
            <div style={{ background: "var(--primary-50)", padding: "1.5rem", borderRadius: "var(--radius-lg)", width: "100%", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-muted)" }}>الاسم:</span> <strong style={{ color: "var(--color-heading)" }}>{fullName}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-muted)" }}>الصف:</span> <strong style={{ color: "var(--color-heading)" }}>{getGradeLabel(grade)}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-muted)" }}>القسم:</span> <strong style={{ color: "var(--color-heading)" }}>{getSectionLabel(section)}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--color-text-muted)" }}>التليفون:</span> <strong style={{ color: "var(--color-heading)" }}>{phone}</strong></div>
            </div>
            
            <div style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
              <button type="button" onClick={goPrev} disabled={isPending} className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
                تعديل البيانات
              </button>
              <button type="submit" disabled={isPending} className="btn btn-primary" style={{ flex: 2, padding: "0.85rem", justifyContent: "center" }}>
                {isPending ? "جاري إنشاء الحساب..." : "نعم، أنشئ الحساب"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
