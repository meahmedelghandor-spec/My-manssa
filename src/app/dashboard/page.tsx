'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Video, FileText, AlertTriangle, Trophy, Clock, Play, ChevronLeft, Bell, BarChart2, CheckCircle, Lock, MessageCircle, Settings, LogOut, Menu, X } from "lucide-react";
import { getUserProfile, logout } from "@/app/actions/auth";
import { getStudentDashboardStats } from "@/app/actions/student";
import VideoModal from "@/components/VideoModal";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState({ name: "جاري التحميل...", gradeLabel: "", progress: 0 });
  
  const [recentLectures, setRecentLectures] = useState<any[]>([]);
  const [totalLectures, setTotalLectures] = useState(0);
  const [courses, setCourses] = useState<any[]>([]);
  const [otherCourses, setOtherCourses] = useState<any[]>([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  
  // New state variables for stats
  const [totalCourses, setTotalCourses] = useState(0);
  const [averageGrade, setAverageGrade] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);

  useEffect(() => {
    getUserProfile().then(profile => {
      if(profile) {
        setStudent(prev => ({ ...prev, name: profile.full_name || "طالب" }));
      }
    });

    getStudentDashboardStats().then(data => {
      setRecentLectures(data.recentLectures);
      setTotalLectures(data.totalLectures);
      setCourses(data.courses);
      setOtherCourses(data.otherCourses || []);
      
      setTotalCourses(data.totalCourses || 0);
      setAverageGrade(data.averageGrade || 0);
      setMistakesCount(data.mistakesCount || 0);
      setStudent(prev => ({ ...prev, progress: data.progress || 0 }));
    });
  }, []);

  const stats = [
    { icon: BookOpen, label: "الكورسات المشترك بها", value: totalCourses.toString(), color: "#3b82f6" },
    { icon: Video, label: "محاضرات متاحة", value: totalLectures.toString(), color: "#6366f1" },
    { icon: Trophy, label: "متوسط الدرجات", value: `${averageGrade}%`, color: "#f59e0b" },
    { icon: AlertTriangle, label: "أخطاء مسجلة", value: mistakesCount.toString(), color: "#ef4444" },
  ];

  return (
    <>
    <main style={{ padding: "1.5rem 1.25rem", maxWidth: 1000, width: "100%", margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)", borderRadius: "var(--radius-xl)", padding: "2.5rem 2rem", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.25), 0 10px 10px -5px rgba(79, 70, 229, 0.1)", flexWrap: "wrap", gap: "1.5rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, insetInlineEnd: -50, width: 200, height: 200, background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.85rem", marginBottom: "0.5rem", textShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>أهلاً بك يا <span style={{ color: "#fde047" }}>{student.name.split(' ')[0]}</span> 👋</h1>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1rem", maxWidth: 400, lineHeight: 1.5 }}>لقد أنجزت {student.progress}% من خطتك الأسبوعية. استمر في التفوق!</p>
            </div>
            <div style={{ position: "relative", width: 85, height: 85, zIndex: 1, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}>
              <svg width="85" height="85" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#fde047" strokeWidth="8" strokeDasharray={`${student.progress * 2.82} 282`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease-out" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1.2rem", color: "#fff" }}>{student.progress}%</div>
            </div>
          </div>


          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: stat.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <stat.icon size={22} color={stat.color} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem", color: "var(--color-heading)", lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={20} color="var(--primary-500)" />
                الكورسات المتاحة لك
              </h2>
              <Link href="/dashboard/lectures" style={{ color: "var(--primary-600)", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                تصفح الكورسات <ChevronLeft size={16} />
              </Link>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {courses.length === 0 ? (
                <div style={{ color: "var(--color-text-muted)" }}>لا توجد كورسات متاحة حالياً للمرحلة الخاصة بك</div>
              ) : (
                courses.map((course) => (
                  <Link 
                    key={course.id} 
                    href={`/dashboard/courses/${course.id}`}
                    style={{ 
                      background: "var(--color-surface)", 
                      border: "1px solid var(--color-border)", 
                      borderRadius: "var(--radius-xl)", 
                      display: "flex", 
                      flexDirection: "column", 
                      boxShadow: "var(--shadow-sm)", 
                      transition: "all 0.3s ease", 
                      overflow: "hidden",
                      textDecoration: "none",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-300)";
                      const img = e.currentTarget.querySelector('.dash-course-img') as HTMLElement;
                      if(img) img.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      const img = e.currentTarget.querySelector('.dash-course-img') as HTMLElement;
                      if(img) img.style.transform = 'scale(1)';
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                      {course.image_url ? (
                        <div className="dash-course-img" style={{ width: "100%", height: "100%", backgroundImage: `url(${course.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s ease' }} />
                      ) : (
                        <div className="dash-course-img" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.5s ease' }}>
                          <BookOpen size={40} color="rgba(255,255,255,0.5)" />
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%)' }} />
                    </div>

                    <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--primary-600)", fontWeight: 700, marginBottom: "0.25rem" }}>
                         {course.grade === 'prep_1' ? 'أولى إعدادي' : course.grade === 'prep_2' ? 'ثانية إعدادي' : course.grade === 'prep_3' ? 'ثالثة إعدادي' : course.grade === 'sec_1' ? 'أولى ثانوي' : course.grade === 'sec_2' ? 'ثانية ثانوي' : course.grade === 'sec_3' ? 'ثالثة ثانوي' : 'كورس دراسي'} - {course.section === 'languages' ? 'لغات' : 'عربي'}
                      </div>
                      <h3 style={{ fontWeight: 800, color: "var(--color-heading)", fontSize: "1.05rem", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {course.title}
                      </h3>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginTop: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", flex: 1 }}>
                        {course.description || "لا يوجد وصف متاح لهذا الكورس."}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                           {course.original_price && course.original_price > course.price && course.enrollment_status !== 'active' ? (
                             <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{course.original_price} ج</span>
                           ) : null}
                           {course.price && course.price > 0 && course.enrollment_status !== 'active' ? (
                             <span style={{ fontWeight: 900, color: "#10b981", fontSize: "1.1rem" }}>{course.price} ج.م</span>
                           ) : course.enrollment_status === 'active' ? (
                             <span style={{ fontWeight: 700, color: "var(--primary-600)", fontSize: "0.9rem" }}>تم الاشتراك ✅</span>
                           ) : (
                             <span style={{ fontWeight: 700, color: "var(--primary-600)", fontSize: "0.9rem" }}>مجاني</span>
                           )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                           <span style={{ fontWeight: 600, color: "var(--color-text-muted)", fontSize: "0.85rem" }}>تصفح</span>
                           <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)' }}>
                              <ChevronLeft size={14} />
                           </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
          
          {/* Recent Lectures */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Play size={20} color="var(--primary-500)" />
                أحدث المحاضرات
              </h2>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {recentLectures.length === 0 ? (
                <div style={{ color: "var(--color-text-muted)" }}>لا توجد محاضرات حالياً</div>
              ) : (
                recentLectures.map((lecture) => (
                  <div key={lecture.id} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "var(--shadow-sm)", transition: "transform var(--transition-fast)" }} className="hover-card">
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--primary-600)", fontWeight: 700, marginBottom: "0.25rem" }}>{lecture.unit_name || lecture.chapter}</div>
                      <h3 style={{ fontWeight: 800, color: "var(--color-heading)", fontSize: "1.05rem", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {lecture.title}
                      </h3>
                      {lecture.lesson_name && <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>{lecture.lesson_name}</div>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      <button onClick={() => setSelectedVideoUrl(lecture.video_url)} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: "var(--radius-md)", border: 'none', cursor: 'pointer' }}>
                        مشاهدة
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Other Courses (Advertising) */}
          {otherCourses.length > 0 && (
            <div style={{ marginBottom: "2rem", marginTop: "3rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <BookOpen size={24} color="var(--primary-600)" />
                  كورسات المنصة
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {otherCourses.map(course => (
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    key={course.id}
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-xl)",
                      overflow: "hidden",
                      boxShadow: "var(--shadow-sm)",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      textDecoration: "none",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-300)";
                      const img = e.currentTarget.querySelector('.other-course-img') as HTMLElement;
                      if(img) img.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      const img = e.currentTarget.querySelector('.other-course-img') as HTMLElement;
                      if(img) img.style.transform = 'scale(1)';
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                      {course.image_url ? (
                        <div className="other-course-img" style={{ width: "100%", height: "100%", backgroundImage: `url(${course.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s ease' }} />
                      ) : (
                        <div className="other-course-img" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.5s ease' }}>
                          <BookOpen size={40} color="rgba(255,255,255,0.5)" />
                        </div>
                      )}
                      
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%)' }} />
                    </div>

                    <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--primary-600)", fontWeight: 700, marginBottom: "0.25rem" }}>
                         {course.grade === 'prep_1' ? 'أولى إعدادي' : course.grade === 'prep_2' ? 'ثانية إعدادي' : course.grade === 'prep_3' ? 'ثالثة إعدادي' : course.grade === 'sec_1' ? 'أولى ثانوي' : course.grade === 'sec_2' ? 'ثانية ثانوي' : course.grade === 'sec_3' ? 'ثالثة ثانوي' : 'كورس دراسي'} - {course.section === 'languages' ? 'لغات' : 'عربي'}
                      </div>
                      <h3 style={{ fontWeight: 800, color: "var(--color-heading)", fontSize: "1.05rem", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {course.title}
                      </h3>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginTop: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", flex: 1 }}>
                        {course.description || "لا يوجد وصف متاح لهذا الكورس."}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                           {course.original_price && course.original_price > course.price ? (
                             <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{course.original_price} ج</span>
                           ) : null}
                           {course.price && course.price > 0 ? (
                             <span style={{ fontWeight: 900, color: "#10b981", fontSize: "1.1rem" }}>{course.price} ج.م</span>
                           ) : (
                             <span style={{ fontWeight: 700, color: "var(--primary-600)", fontSize: "0.9rem" }}>مجاني</span>
                           )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                           <span style={{ fontWeight: 600, color: "var(--color-text-muted)", fontSize: "0.85rem" }}>تصفح</span>
                           <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)' }}>
                              <ChevronLeft size={14} />
                           </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
    </main>

      <VideoModal
        isOpen={!!selectedVideoUrl}
        videoUrl={selectedVideoUrl || ''}
        onClose={() => setSelectedVideoUrl(null)}
      />

      <style>{`
        .hover-card:hover { transform: translateY(-3px); border-color: var(--primary-300); }
      `}</style>
    </>
  );
}
