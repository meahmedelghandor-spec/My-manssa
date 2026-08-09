'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Play, CheckCircle, Lock, Clock, Search, ChevronDown, ChevronUp, BarChart2, FileText, AlertTriangle, MessageCircle, Settings, LogOut, Menu, X, BookOpen, Upload, Download } from "lucide-react";
import { getStudentHomeworks, submitHomework } from "@/app/actions/homework";
import { getUserProfile, logout } from "@/app/actions/auth";

export default function HomeworkPage() {
  const [search, setSearch] = useState("");
  const [homeworks, setHomeworks] = useState<any[]>([]);
  
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submitUrl, setSubmitUrl] = useState("");

  const loadData = () => {
    getStudentHomeworks().then(data => setHomeworks(data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent, hwId: string) => {
    e.preventDefault();
    if (!submitUrl) return alert('الرجاء إدخال رابط الملف');
    
    const res = await submitHomework(hwId, submitUrl);
    if (res.success) {
      alert("تم تسليم الواجب بنجاح!");
      setSubmittingId(null);
      setSubmitUrl("");
      loadData();
    } else {
      alert(res.error);
    }
  };

  const filtered = search
    ? homeworks.filter(h => h.title.includes(search) || (h.description && h.description.includes(search)))
    : homeworks;

  return (
        <main style={{ padding: "1.5rem 1.25rem", maxWidth: 900, width: "100%", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "var(--color-heading)", marginBottom: "0.3rem" }}>📚 حل الواجب</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>حمل ملفات الواجب، حلها، ثم قم بتسليمها لمعلمك لتصحيحها.</p>
          </div>

          <div style={{ position: "relative", marginBottom: "2rem" }}>
            <Search size={16} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", insetInlineStart: "0.9rem", color: "var(--color-text-muted)" }} />
            <input type="text" className="form-input" placeholder="ابحث عن واجب..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingInlineStart: "2.5rem" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)" }}>
                <FileText size={48} color="var(--color-border-strong)" style={{ margin: "0 auto 1rem" }} />
                <h4 style={{ color: "var(--color-heading)", fontWeight: 700, marginBottom: "0.5rem" }}>لا توجد واجبات متاحة</h4>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>ستظهر هنا الواجبات المخصصة للكورسات المشترك بها.</p>
              </div>
            ) : (
              filtered.map((hw) => (
                <div key={hw.id} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "var(--shadow-sm)", transition: "transform var(--transition-fast)" }} className="hover-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                        <span style={{ background: "var(--primary-50)", color: "var(--primary-600)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700 }}>
                          {hw.course_title}
                        </span>
                        {hw.due_date && (
                          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#b45309", background: "#fef3c7", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700 }}>
                            <Clock size={14} /> التسليم: {new Date(hw.due_date).toLocaleDateString('ar-EG')}
                          </span>
                        )}
                        {hw.submission && (
                          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#059669", background: "#ecfdf5", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700 }}>
                            <CheckCircle size={14} /> تم التسليم
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--color-heading)", fontSize: "1.2rem", lineHeight: 1.4, marginBottom: "0.5rem" }}>
                        {hw.title}
                      </h3>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                        {hw.description || "لا يوجد وصف."}
                      </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "stretch", width: "100%", maxWidth: 200 }}>
                      {hw.file_url && (
                        <a href={hw.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
                          <Download size={16} /> تحميل الواجب
                        </a>
                      )}
                      {!hw.submission ? (
                        <button onClick={() => setSubmittingId(submittingId === hw.id ? null : hw.id)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
                          <Upload size={16} /> تسليم الإجابة
                        </button>
                      ) : (
                         <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                           {hw.submission.grade !== null ? (
                             <span style={{ color: 'var(--primary-600)', fontWeight: 700 }}>الدرجة: {hw.submission.grade}</span>
                           ) : (
                             <span>في انتظار التصحيح...</span>
                           )}
                         </div>
                      )}
                    </div>
                  </div>

                  {submittingId === hw.id && (
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                      <form onSubmit={(e) => handleSubmit(e, hw.id)} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                          <label className="form-label">رابط ملف الإجابة (PDF/Drive)</label>
                          <input type="url" className="form-input" required placeholder="https://..." value={submitUrl} onChange={e => setSubmitUrl(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">تأكيد التسليم</button>
                      </form>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </main>
  );
}
