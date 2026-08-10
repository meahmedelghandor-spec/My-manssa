'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, X, BookOpen, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { createCourse, getAdminCourses, updateCourse, deleteCourse } from '@/app/actions/courses';
import { createClient } from '@/utils/supabase/client';

const GRADES = [
  { id: 'prep_1', label: 'الصف الأول الإعدادي' },
  { id: 'prep_2', label: 'الصف الثاني الإعدادي' },
  { id: 'prep_3', label: 'الصف الثالث الإعدادي' },
  { id: 'sec_1', label: 'الصف الأول الثانوي' },
  { id: 'sec_2', label: 'الصف الثاني الثانوي' },
  { id: 'sec_3', label: 'الصف الثالث الثانوي' },
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('arabic');
  const [price, setPrice] = useState('0');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const data = await getAdminCourses();
    setCourses(data);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    let imageUrl = '';
    
    if (imageFile) {
      const supabase = createClient();
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('courses')
        .upload(filePath, imageFile);
        
      if (uploadError) {
        setErrorMsg("خطأ في رفع الصورة: " + uploadError.message);
        setIsSubmitting(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('courses')
        .getPublicUrl(filePath);
        
      imageUrl = publicUrl;
    }

    if (editCourseId) {
      const res = await updateCourse(editCourseId, { title, description, grade, section, price: parseFloat(price) || 0, image_url: imageUrl || undefined });
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        closeModal();
        fetchCourses();
      }
    } else {
      const res = await createCourse({ title, description, grade, section, price: parseFloat(price) || 0, image_url: imageUrl });
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        closeModal();
        fetchCourses();
      }
    }
    
    setIsSubmitting(false);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditCourseId(null);
    setTitle('');
    setDescription('');
    setGrade('');
    setSection('arabic');
    setPrice('0');
    setImageFile(null);
    setErrorMsg('');
  };

  const handleEditClick = (course: any) => {
    setEditCourseId(course.id);
    setTitle(course.title || '');
    setDescription(course.description || '');
    setGrade(course.grade || '');
    setSection(course.section || 'arabic');
    setPrice(course.price ? String(course.price) : '0');
    setShowAddModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكورس؟ سيتم حذف جميع المحاضرات والبيانات المرتبطة به.')) {
      const res = await deleteCourse(id);
      if (res?.error) {
        alert(res.error);
      } else {
        fetchCourses();
      }
    }
  };

  const getGradeLabel = (gId: string) => GRADES.find(g => g.id === gId)?.label || gId;
  const getSectionLabel = (sId: string) => sId === 'arabic' ? 'عربي' : 'لغات';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.75rem', color: 'var(--color-heading)', marginBottom: '0.25rem' }}>
            إدارة الكورسات
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>يمكنك إضافة وتعديل الكورسات التي سيشترك بها الطلاب</p>
        </div>
        <button onClick={() => { closeModal(); setShowAddModal(true); }} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-full)' }}>
          <Plus size={18} /> إضافة كورس جديد
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {courses.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', gridColumn: '1 / -1' }}>
            <BookOpen size={48} color="var(--color-border-strong)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>لا توجد كورسات</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>ابدأ بإضافة أول كورس لطلابك الآن.</p>
          </div>
        ) : (
          courses.map(course => (
            <Link 
              href={`/admin/courses/${course.id}`} 
              key={course.id} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)', 
                borderRadius: 'var(--radius-xl)', 
                overflow: 'hidden', 
                textDecoration: 'none', 
                color: 'inherit', 
                transition: "all 0.3s ease",
                boxShadow: "var(--shadow-sm)",
                position: 'relative'
              }} 
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-300)";
                const img = e.currentTarget.querySelector('.admin-course-img') as HTMLElement;
                if(img) img.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                const img = e.currentTarget.querySelector('.admin-course-img') as HTMLElement;
                if(img) img.style.transform = 'scale(1)';
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 220, overflow: 'hidden' }}>
                {course.image_url ? (
                  <div className="admin-course-img" style={{ width: '100%', height: '100%', backgroundImage: `url(${course.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s ease' }} />
                ) : (
                  <div className="admin-course-img" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.5s ease' }}>
                    <BookOpen size={48} color="rgba(255,255,255,0.5)" />
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%)', pointerEvents: 'none' }} />
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-heading)' }}>
                    {course.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', position: 'relative', zIndex: 10 }}>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEditClick(course); }} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-600)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')} title="تعديل"><Edit2 size={14} /></button>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteClick(course.id); }} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')} onMouseLeave={(e) => (e.currentTarget.style.background = '#fef2f2')} title="حذف"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', flex: 1, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description || 'لا يوجد وصف'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ background: 'var(--primary-50)', color: 'var(--primary-600)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                    {getGradeLabel(course.grade)}
                  </span>
                  <span style={{ background: course.section === 'languages' ? '#fdf4ff' : '#ecfdf5', color: course.section === 'languages' ? '#c026d3' : '#059669', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                    {getSectionLabel(course.section)}
                  </span>
                  <span style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginInlineStart: 'auto' }}>
                    {course.price > 0 ? `${course.price} ج.م` : 'مجاني'}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 500, overflow: 'hidden', animation: 'scaleIn 0.3s ease', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-heading)' }}>{editCourseId ? 'تعديل كورس' : 'إضافة كورس جديد'}</h3>
              <button type="button" onClick={() => !isSubmitting && closeModal()} style={{ background: 'var(--color-bg)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text)' }}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddCourse} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {errorMsg && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', border: '1px solid #fecaca' }}>{errorMsg}</div>}
              
              <div className="form-group">
                <label className="form-label">اسم الكورس *</label>
                <input type="text" className="form-input" placeholder="مثال: كورس المراجعة النهائية" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">وصف الكورس</label>
                <textarea className="form-input" placeholder="اكتب وصفاً مختصراً عما يحتويه الكورس" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">الصف الدراسي *</label>
                  <select className="form-input" value={grade} onChange={(e) => setGrade(e.target.value)} required>
                    <option value="">اختر الصف</option>
                    {GRADES.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">القسم *</label>
                  <select className="form-input" value={section} onChange={(e) => setSection(e.target.value)} required>
                    <option value="arabic">عربي</option>
                    <option value="languages">لغات</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">سعر الكورس (ج.م) *</label>
                <input type="number" className="form-input" min="0" placeholder="مثال: 150" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>اكتب 0 إذا كان الكورس مجانياً وسيفتح للطلاب فوراً.</p>
              </div>

              <div className="form-group">
                <label className="form-label">صورة الغلاف للكورس (اختياري)</label>
                <input type="file" className="form-input" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} style={{ padding: '0.5rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={closeModal} className="btn btn-ghost" disabled={isSubmitting}>إلغاء</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'جاري الحفظ...' : (editCourseId ? 'حفظ التعديلات' : 'حفظ الكورس')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
