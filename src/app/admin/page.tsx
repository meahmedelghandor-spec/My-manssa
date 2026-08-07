'use client';

import { useState, useEffect } from 'react';
import { Users, Video, Eye, UploadCloud, Plus, X, FileText } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { createLecture, getAdminStats } from '@/app/actions/admin';
import { getAdminCourses } from '@/app/actions/courses';

export default function AdminDashboardPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const [uploadTitle, setUploadTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [unitName, setUnitName] = useState('');
  const [lessonName, setLessonName] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const [courses, setCourses] = useState<any[]>([]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [statsData, setStatsData] = useState({
    studentsCount: 0,
    lecturesCount: 0,
    recentLectures: [] as any[],
  });

  useEffect(() => {
    getAdminStats().then((data) => {
      setStatsData(data);
    });
    getAdminCourses().then(data => {
      setCourses(data);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!uploadTitle || !courseId || !unitName || !lessonName || !videoFile) {
      setErrorMsg('الرجاء إكمال جميع البيانات واختيار ملف الفيديو');
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();
      
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `videos/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lectures')
        .upload(filePath, videoFile);
        
      if (uploadError) {
        throw new Error("خطأ في رفع الفيديو: " + uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('lectures')
        .getPublicUrl(filePath);

      const res = await createLecture({
        title: uploadTitle,
        courseId: courseId,
        unitName: unitName,
        lessonName: lessonName,
        videoUrl: publicUrl
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      setSuccessMsg("تم رفع المحاضرة بنجاح!");
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadTitle("");
        setCourseId("");
        setUnitName("");
        setLessonName("");
        setVideoFile(null);
        setSuccessMsg("");
        
        getAdminStats().then(setStatsData);
      }, 2000);

    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ غير معروف");
    } finally {
      setIsUploading(false);
    }
  };

  const stats = [
    { label: "إجمالي الطلاب", value: statsData.studentsCount.toString(), icon: Users, color: "#3b82f6", bg: "#eff6ff" },
    { label: "المحاضرات", value: statsData.lecturesCount.toString(), icon: Video, color: "#10b981", bg: "#f0fdf4" },
    { label: "مشاهدات اليوم", value: "0", icon: Eye, color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "الامتحانات المجابة", value: "0", icon: FileText, color: "#f59e0b", bg: "#fffbeb" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.75rem", color: "var(--color-heading)", marginBottom: "0.25rem" }}>
            لوحة التحكم الرئيسية
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>نظرة عامة على أداء المنصة والمحتوى</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary" style={{ padding: "0.8rem 1.5rem", borderRadius: "var(--radius-full)" }}>
          <Plus size={18} /> رفع محاضرة جديدة
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <div style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>{stat.label}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.6rem", color: "var(--color-heading)" }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--color-heading)" }}>آخر المحاضرات المضافة</h2>
            <button style={{ color: "var(--primary-500)", background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem" }}>عرض الكل</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {statsData.recentLectures.length === 0 ? (
              <div style={{ textAlign: "center", padding: "1rem", color: "var(--color-text-muted)" }}>لا توجد محاضرات بعد</div>
            ) : (
              statsData.recentLectures.map((upload) => (
                <div key={upload.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "8px", background: "var(--primary-50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Video size={20} color="var(--primary-500)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--color-heading)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{upload.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                      <span>{upload.unit_name || upload.chapter}</span>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "center", background: "var(--color-bg)", padding: "0.25rem 0.75rem", borderRadius: "var(--radius-full)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>مشاهدة</div>
                    <div style={{ fontWeight: 800, color: "var(--color-heading)", fontSize: "0.85rem" }}>{upload.views_count || 0}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, var(--primary-600), var(--primary-800))", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", padding: "2rem", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", boxShadow: "var(--shadow-primary)" }}>
          <UploadCloud size={48} color="rgba(255,255,255,0.8)" style={{ marginBottom: "1rem" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.4rem", marginBottom: "0.5rem" }}>مساحة التخزين (Supabase)</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginBottom: "1.5rem", maxWidth: 300 }}>
            يمكنك رفع الفيديوهات وملفات الـ PDF والامتحانات مباشرة إلى مساحة التخزين الخاصة بك.
          </p>
        </div>
      </div>

      {showUploadModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(4px)", overflowY: "auto" }}>
          <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: 500, overflow: "hidden", animation: "scaleIn 0.3s ease", boxShadow: "var(--shadow-xl)", margin: "auto" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--color-heading)" }}>رفع محاضرة جديدة</h3>
              <button onClick={() => !isUploading && setShowUploadModal(false)} style={{ background: "var(--color-bg)", border: "none", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-text)" }}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleUpload} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {errorMsg && <div style={{ background: "#fef2f2", color: "#ef4444", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.85rem", border: "1px solid #fecaca" }}>{errorMsg}</div>}
              {successMsg && <div style={{ background: "#f0fdf4", color: "#10b981", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.85rem", border: "1px solid #bbf7d0" }}>{successMsg}</div>}
              
              <div className="form-group">
                <label className="form-label">عنوان المحاضرة (العنوان الفرعي)</label>
                <input type="text" className="form-input" placeholder="مثال: الجزء الأول من قوانين نيوتن" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">الكورس التابع له</label>
                {courses.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: '#ef4444', padding: '0.5rem', background: '#fef2f2', borderRadius: 'var(--radius-md)' }}>
                    يجب إضافة كورس واحد على الأقل من قسم "الكورسات" قبل رفع المحاضرات.
                  </div>
                ) : (
                  <select className="form-input" value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
                    <option value="">اختر الكورس</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title} ({c.section === 'arabic' ? 'عربي' : 'لغات'})</option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">الوحدة</label>
                  <input type="text" className="form-input" placeholder="مثال: الوحدة الأولى" value={unitName} onChange={(e) => setUnitName(e.target.value)} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">الدرس</label>
                  <input type="text" className="form-input" placeholder="مثال: الدرس الأول" value={lessonName} onChange={(e) => setLessonName(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">ملف الفيديو (MP4)</label>
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed var(--color-border-strong)", borderRadius: "var(--radius-lg)", padding: "1.5rem", cursor: "pointer", background: "var(--color-bg)", transition: "all var(--transition-fast)" }} className="upload-zone">
                  <input type="file" accept="video/*" style={{ display: "none" }} onChange={handleFileChange} />
                  <UploadCloud size={32} color={videoFile ? "var(--primary-500)" : "var(--color-text-muted)"} style={{ marginBottom: "0.5rem" }} />
                  <span style={{ fontWeight: 600, color: videoFile ? "var(--primary-600)" : "var(--color-text)", fontSize: "0.9rem", textAlign: "center" }}>
                    {videoFile ? videoFile.name : "اضغط لاختيار فيديو أو اسحب الملف هنا"}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>الحد الأقصى للملف: 2GB</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-ghost" disabled={isUploading}>إلغاء</button>
                <button type="submit" className="btn btn-primary" disabled={isUploading || courses.length === 0}>
                  {isUploading ? "جاري الرفع... الرجاء الانتظار" : "رفع المحاضرة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
