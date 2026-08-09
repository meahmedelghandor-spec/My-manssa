'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Play, CheckCircle, Lock, Clock, Search, ChevronDown, ChevronUp, BarChart2, FileText, AlertTriangle, MessageCircle, Settings, LogOut, Menu, X, BookOpen, ChevronLeft, Image as ImageIcon } from "lucide-react";
import { getStudentExams } from "@/app/actions/student";
import { getUserProfile, logout } from "@/app/actions/auth";

export default function StudentExamsPage() {
  const [search, setSearch] = useState("");
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    getStudentExams().then(data => {
      setExams(data);
    });
  }, []);

  const filtered = search
    ? exams.filter(e => e.title.includes(search) || (e.description && e.description.includes(search)))
    : exams;

  return (
        <main style={{ padding: "1.5rem 1.25rem", maxWidth: 900, width: "100%", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "var(--color-heading)", marginBottom: "0.3rem" }}>📝 الامتحانات</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>امتحن وقيم مستواك أول بأول</p>
          </div>

          <div style={{ position: "relative", marginBottom: "2rem" }}>
            <Search size={16} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", insetInlineStart: "0.9rem", color: "var(--color-text-muted)" }} />
            <input type="text" className="form-input" placeholder="ابحث عن امتحان..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingInlineStart: "2.5rem" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)" }}>
                <FileText size={48} color="var(--color-border-strong)" style={{ margin: "0 auto 1rem" }} />
                <h4 style={{ color: "var(--color-heading)", fontWeight: 700, marginBottom: "0.5rem" }}>لا توجد امتحانات متاحة</h4>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>ستظهر هنا الامتحانات المخصصة للكورسات المشترك بها.</p>
              </div>
            ) : (
              filtered.map((exam) => (
                <div key={exam.id} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "var(--shadow-sm)", transition: "transform var(--transition-fast)" }} className="hover-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                        <span style={{ background: "var(--primary-50)", color: "var(--primary-600)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700 }}>
                          {exam.course_title}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
                          <Clock size={14} /> {exam.time_limit_minutes} دقيقة
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--color-heading)", fontSize: "1.2rem", lineHeight: 1.4, marginBottom: "0.5rem" }}>
                        {exam.title}
                      </h3>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                        {exam.description || "لا يوجد وصف."}
                      </p>
                    </div>
                    <Link href={`/dashboard/exams/${exam.id}`} className="btn btn-primary" style={{ padding: "0.6rem 1.5rem", fontSize: "0.95rem", borderRadius: "var(--radius-full)" }}>
                      ابدأ الامتحان
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>
  );
}
