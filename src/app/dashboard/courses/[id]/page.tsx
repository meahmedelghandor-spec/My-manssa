"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Play, ChevronLeft, ChevronDown, ChevronUp, BarChart2, FileText, AlertTriangle, MessageCircle, Settings, LogOut, Menu, X, BookOpen, ArrowRight, Lock } from "lucide-react";
import { getCourseLectures } from "@/app/actions/student";
import { getUserProfile, logout } from "@/app/actions/auth";
import { useParams, useRouter } from "next/navigation";
import VideoModal from "@/components/VideoModal";

export default function CourseDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [openUnits, setOpenUnits] = useState<string[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isCourseLocked, setIsCourseLocked] = useState(false);

  useEffect(() => {
    getCourseLectures(id).then(res => {
      if (res.locked) {
        setIsCourseLocked(true);
      }
      if (res.grouped) {
        const formatted = Object.keys(res.grouped).map(unit => ({
          id: unit,
          title: unit,
          lectures: res.grouped[unit]
        }));
        setUnits(formatted);
        if (formatted.length > 0) {
          setOpenUnits([formatted[0].id]);
        }
      }
    });
  }, [id, router]);

  const toggleUnit = (unitId: string) => {
    setOpenUnits((prev) => prev.includes(unitId) ? prev.filter((u) => u !== unitId) : [...prev, unitId]);
  };

  return (
    <>
        <main style={{ padding: "1.5rem 1.25rem", maxWidth: 900, width: "100%", margin: "0 auto" }}>
          
          <Link href="/dashboard/lectures" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1.5rem", textDecoration: "none" }}>
            <ArrowRight size={16} /> العودة للكورسات
          </Link>

          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "var(--color-heading)", marginBottom: "0.3rem" }}>محتوى الكورس</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>جميع الوحدات والدروس الخاصة بهذا الكورس</p>
          </div>

          {isCourseLocked && (
            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "var(--radius-md)", padding: "1rem", marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#ef4444" }}>
                <Lock size={20} />
                <span style={{ fontWeight: 600 }}>يجب الاشتراك في الكورس لتتمكن من مشاهدة المحاضرات.</span>
              </div>
              <Link href={`/dashboard/courses/${id}/enroll`} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", textDecoration: "none" }}>
                اشترك الآن
              </Link>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {units.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>لا توجد محاضرات متاحة حالياً في هذا الكورس</div>
            ) : (
              units.map((unit) => {
                const isOpen = openUnits.includes(unit.id);
                return (
                  <div key={unit.id} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                    <div onClick={() => toggleUnit(unit.id)} style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: isOpen ? "var(--primary-50)" : "transparent", transition: "background 0.3s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: isOpen ? "var(--primary-200)" : "var(--color-bg)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: isOpen ? "var(--primary-700)" : "var(--color-text)" }}>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        <div>
                          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--color-heading)" }}>{unit.title}</h2>
                          <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.15rem" }}>{unit.lectures.length} دروس ومحاضرات</div>
                        </div>
                      </div>
                    </div>
                    {isOpen && (
                      <div style={{ padding: "0.5rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {unit.lectures.map((lec: any) => (
                          <div key={lec.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-bg)" }}>
                            <div style={{ width: 44, height: 44, borderRadius: "10px", background: "var(--primary-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Video size={22} color="var(--primary-600)" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 800, color: "var(--color-heading)", fontSize: "0.95rem" }}>{lec.title}</div>
                              {lec.lesson_name && <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>{lec.lesson_name}</div>}
                            </div>
                            {isCourseLocked ? (
                              <button disabled style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: "var(--radius-md)", flexShrink: 0, border: 'none', background: 'var(--color-bg-muted)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'not-allowed' }}>
                                <Lock size={14} /> مقفول
                              </button>
                            ) : (
                              <button onClick={() => setSelectedVideoUrl(lec.video_url)} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: "var(--radius-md)", flexShrink: 0, border: 'none', cursor: 'pointer' }}>
                                مشاهدة
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </main>

      <VideoModal
        isOpen={!!selectedVideoUrl}
        videoUrl={selectedVideoUrl || ''}
        onClose={() => setSelectedVideoUrl(null)}
      />
    </>
  );
}
