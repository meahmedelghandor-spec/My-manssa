'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Play, CheckCircle, Lock, Clock, Search, ChevronDown, ChevronUp, BarChart2, FileText, AlertTriangle, MessageCircle, Settings, LogOut, Menu, X, BookOpen, ChevronLeft, Image as ImageIcon } from "lucide-react";
import { getStudentCourses } from "@/app/actions/student";
import { getUserProfile, logout } from "@/app/actions/auth";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    getStudentCourses().then(data => {
      setCourses(data);
    });
  }, []);

  const filtered = search
    ? courses.filter(c => c.title.includes(search) || (c.description && c.description.includes(search)))
    : courses;

  return (
        <main style={{ padding: "1.5rem 1.25rem", maxWidth: 900, width: "100%", margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "var(--color-heading)", marginBottom: "0.3rem" }}>📚 الكورسات</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>تصفح الكورسات المتاحة للمرحلة الخاصة بك</p>
          </div>

          <div style={{ position: "relative", marginBottom: "2rem" }}>
            <Search size={16} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", insetInlineStart: "0.9rem", color: "var(--color-text-muted)" }} />
            <input type="text" className="form-input" placeholder="ابحث عن كورس..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingInlineStart: "2.5rem" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)", gridColumn: "1 / -1" }}>لا توجد كورسات متاحة حالياً</div>
            ) : (
              filtered.map((course) => (
                <div 
                  key={course.id} 
                  style={{ 
                    background: "var(--color-surface)", 
                    border: "1px solid var(--color-border)", 
                    borderRadius: "var(--radius-xl)", 
                    overflow: "hidden", 
                    display: "flex", 
                    flexDirection: "column", 
                    boxShadow: "var(--shadow-sm)", 
                    transition: "all 0.3s ease",
                    position: "relative"
                  }} 
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-300)";
                    const img = e.currentTarget.querySelector('.lectures-course-img') as HTMLElement;
                    if(img) img.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                    const img = e.currentTarget.querySelector('.lectures-course-img') as HTMLElement;
                    if(img) img.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: 220, overflow: 'hidden' }}>
                    {course.image_url ? (
                      <div className="lectures-course-img" style={{ width: '100%', height: '100%', backgroundImage: `url(${course.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s ease' }}>
                        {course.enrollment_status === 'locked' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={32} color="#fff" /></div>}
                        {course.enrollment_status === 'pending' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={32} color="#fff" /></div>}
                      </div>
                    ) : (
                      <div className="lectures-course-img" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.5s ease' }}>
                        <BookOpen size={48} color="rgba(255,255,255,0.5)" />
                        {course.enrollment_status === 'locked' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={32} color="#fff" /></div>}
                        {course.enrollment_status === 'pending' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={32} color="#fff" /></div>}
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    {/* Grade and Section badges */}
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.5rem', zIndex: 2 }}>
                       <span style={{ background: "rgba(255,255,255,0.9)", color: "var(--primary-700)", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.7rem", fontWeight: 700, backdropFilter: "blur(4px)" }}>
                          {course.grade === 'prep_1' ? 'أولى إعدادي' : course.grade === 'prep_2' ? 'ثانية إعدادي' : course.grade === 'prep_3' ? 'ثالثة إعدادي' : course.grade === 'sec_1' ? 'أولى ثانوي' : course.grade === 'sec_2' ? 'ثانية ثانوي' : course.grade === 'sec_3' ? 'ثالثة ثانوي' : 'كورس دراسي'}
                       </span>
                       <span style={{ background: course.section === 'languages' ? 'rgba(192,38,211,0.9)' : 'rgba(5,150,105,0.9)', color: "#fff", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-full)", fontSize: "0.7rem", fontWeight: 700, backdropFilter: "blur(4px)" }}>
                          {course.section === 'languages' ? 'لغات' : 'عربي'}
                       </span>
                    </div>
                  </div>

                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <h3 style={{ fontWeight: 900, fontFamily: "var(--font-display)", color: "var(--color-heading)", fontSize: "1.1rem", lineHeight: 1.4, marginBottom: "0.5rem" }}>
                        {course.title}
                      </h3>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {course.description || "لا يوجد وصف متاح"}
                      </p>
                    </div>
                    <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
                      {course.enrollment_status === 'locked' ? (
                        <Link href={`/dashboard/courses/${course.id}/enroll`} className="btn btn-primary" style={{ width: "100%", padding: "0.6rem 1rem", fontSize: "0.9rem", borderRadius: "var(--radius-md)", justifyContent: "center", background: 'var(--color-surface)', color: 'var(--primary-600)', border: '1px solid var(--primary-200)' }}>
                          <Lock size={16} style={{ marginInlineEnd: 4 }} /> اشترك الآن
                        </Link>
                      ) : course.enrollment_status === 'pending' ? (
                        <button disabled className="btn" style={{ width: "100%", padding: "0.6rem 1rem", fontSize: "0.9rem", borderRadius: "var(--radius-md)", justifyContent: "center", background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' }}>
                          <Clock size={16} style={{ marginInlineEnd: 4 }} /> قيد المراجعة
                        </button>
                      ) : (
                        <Link href={`/dashboard/courses/${course.id}`} className="btn btn-primary" style={{ width: "100%", padding: "0.6rem 1rem", fontSize: "0.9rem", borderRadius: "var(--radius-md)", justifyContent: "center" }}>
                          تصفح المحتوى <ChevronLeft size={16} style={{ marginInlineStart: 4 }} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </main>
  );
}
