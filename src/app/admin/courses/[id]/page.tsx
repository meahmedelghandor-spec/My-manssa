'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Video, FileText, Upload, Plus, Edit2, Trash2, X, PlusCircle, CheckCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getExamsByCourse, createExam, addQuestionToExam } from '@/app/actions/exams';
import { getHomeworksByCourse, createHomework } from '@/app/actions/homework';
import { getLecturesByCourse, createLecture, deleteLecture } from '@/app/actions/lectures';

export default function AdminCourseDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'lectures' | 'exams' | 'homework'>('exams');
  const [isLoading, setIsLoading] = useState(true);

  // Lectures State
  const [lectures, setLectures] = useState<any[]>([]);
  const [showAddLectureModal, setShowAddLectureModal] = useState(false);
  const [lecTitle, setLecTitle] = useState('');
  const [lecDesc, setLecDesc] = useState('');
  const [lecUrl, setLecUrl] = useState('');
  const [lecChapter, setLecChapter] = useState('');
  const [lecUnit, setLecUnit] = useState('');
  const [lecLesson, setLecLesson] = useState('');

  // Exams State
  const [exams, setExams] = useState<any[]>([]);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [examDesc, setExamDesc] = useState('');
  const [examTime, setExamTime] = useState(60);

  // Homework State
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [showAddHomeworkModal, setShowAddHomeworkModal] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwFileUrl, setHwFileUrl] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');

  // Questions State
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrectIdx, setQCorrectIdx] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    loadCourseDetails();
  }, [id]);

  const loadCourseDetails = async () => {
    setIsLoading(true);
    // Fetch Course
    const { data: cData } = await supabase.from('courses').select('*').eq('id', id).single();
    if (cData) setCourse(cData);

    // Fetch Lectures
    const lData = await getLecturesByCourse(id);
    setLectures(lData || []);

    // Fetch Exams
    const eData = await getExamsByCourse(id);
    setExams(eData || []);

    // Fetch Homeworks
    const hwData = await getHomeworksByCourse(id);
    setHomeworks(hwData || []);
    
    setIsLoading(false);
  };

  const handleCreateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createLecture({ course_id: id, title: lecTitle, description: lecDesc, video_url: lecUrl, chapter: lecChapter, unit_name: lecUnit, lesson_name: lecLesson });
    if (res.success) {
      setShowAddLectureModal(false);
      setLecTitle('');
      setLecDesc('');
      setLecUrl('');
      setLecChapter('');
      setLecUnit('');
      setLecLesson('');
      loadCourseDetails();
    } else {
      alert(res.error);
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه المحاضرة؟")) {
      const res = await deleteLecture(lectureId, id);
      if (res.success) {
        loadCourseDetails();
      } else {
        alert(res.error);
      }
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createExam({ course_id: id, title: examTitle, description: examDesc, time_limit_minutes: examTime });
    if (res.success) {
      setShowAddExamModal(false);
      setExamTitle('');
      setExamDesc('');
      setExamTime(60);
      loadCourseDetails();
    } else {
      alert(res.error);
    }
  };

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createHomework({ course_id: id, title: hwTitle, description: hwDesc, file_url: hwFileUrl, due_date: hwDueDate });
    if (res.success) {
      setShowAddHomeworkModal(false);
      setHwTitle('');
      setHwDesc('');
      setHwFileUrl('');
      setHwDueDate('');
      loadCourseDetails();
    } else {
      alert(res.error);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;
    
    // filter empty options
    const validOptions = qOptions.filter(o => o.trim() !== '');
    if (validOptions.length < 2) {
      alert("يجب إضافة اختيارين على الأقل");
      return;
    }

    const res = await addQuestionToExam({
      exam_id: selectedExamId,
      question_text: qText,
      options: validOptions,
      correct_option_index: qCorrectIdx > validOptions.length - 1 ? 0 : qCorrectIdx,
      points: 1
    });

    if (res.success) {
      setShowAddQuestionModal(false);
      setQText('');
      setQOptions(['', '', '', '']);
      setQCorrectIdx(0);
      alert("تمت إضافة السؤال بنجاح!");
    } else {
      alert(res.error);
    }
  };

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>جاري التحميل...</div>;
  if (!course) return <div style={{ padding: '2rem', textAlign: 'center' }}>الكورس غير موجود.</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/courses" className="btn btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <ChevronRight size={24} />
        </Link>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.75rem', color: 'var(--color-heading)' }}>
            إدارة: {course.title}
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>إدارة محتوى الكورس من محاضرات، امتحانات، وواجبات</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Course Info Sidebar */}
        <div style={{ width: '100%', maxWidth: 320, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          {course.image_url ? (
            <div style={{ width: '100%', height: 180, backgroundImage: `url(${course.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ) : (
            <div style={{ width: '100%', height: 180, background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={48} color="var(--primary-300)" />
            </div>
          )}
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--primary-50)', color: 'var(--primary-600)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                {course.grade}
              </span>
              <span style={{ background: course.section === 'languages' ? '#fdf4ff' : '#ecfdf5', color: course.section === 'languages' ? '#c026d3' : '#059669', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                {course.section === 'languages' ? 'لغات' : 'عربي'}
              </span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {course.description}
            </p>
          </div>
        </div>

        {/* Content Tabs */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {/* Tabs Navigation */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '2px' }}>
            <button
              onClick={() => setActiveTab('lectures')}
              style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'lectures' ? '2px solid var(--primary-600)' : '2px solid transparent', color: activeTab === 'lectures' ? 'var(--primary-600)' : 'var(--color-text-muted)', fontWeight: activeTab === 'lectures' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <Video size={18} /> الفيديوهات والمحاضرات
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'exams' ? '2px solid var(--primary-600)' : '2px solid transparent', color: activeTab === 'exams' ? 'var(--primary-600)' : 'var(--color-text-muted)', fontWeight: activeTab === 'exams' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <FileText size={18} /> الامتحانات
            </button>
            <button
              onClick={() => setActiveTab('homework')}
              style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'homework' ? '2px solid var(--primary-600)' : '2px solid transparent', color: activeTab === 'homework' ? 'var(--primary-600)' : 'var(--color-text-muted)', fontWeight: activeTab === 'homework' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <Upload size={18} /> الواجبات والمرفقات
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'lectures' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-heading)' }}>إدارة الفيديوهات</h3>
                <button onClick={() => setShowAddLectureModal(true)} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.25rem' }}>
                  <Plus size={18} /> رفع محاضرة جديدة
                </button>
              </div>
              
              {lectures.length === 0 ? (
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <Video size={48} color="var(--color-border-strong)" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ color: 'var(--color-heading)', fontWeight: 700, marginBottom: '0.5rem' }}>لا توجد محاضرات بعد</h4>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {lectures.map(lecture => (
                    <div key={lecture.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-heading)' }}>{lecture.title}</h4>
                        <button onClick={() => handleDeleteLecture(lecture.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--primary-600)' }}>
                        {lecture.unit_name && <span>{lecture.unit_name}</span>}
                        {lecture.lesson_name && <span>- {lecture.lesson_name}</span>}
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{lecture.description}</p>
                      <div style={{ marginTop: '0.5rem' }}>
                         <a href={lecture.video_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-600)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                           <Video size={16} /> مشاهدة الفيديو
                         </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-heading)' }}>إدارة الامتحانات</h3>
                <button onClick={() => setShowAddExamModal(true)} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.25rem' }}>
                  <Plus size={18} /> إضافة امتحان جديد
                </button>
              </div>

              {exams.length === 0 ? (
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <FileText size={48} color="var(--color-border-strong)" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ color: 'var(--color-heading)', fontWeight: 700, marginBottom: '0.5rem' }}>لا توجد امتحانات بعد</h4>
                  <p>قم بإنشاء وتخصيص امتحانات لتقييم طلابك في هذا الكورس.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {exams.map(exam => (
                    <div key={exam.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-heading)' }}>{exam.title}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', background: 'var(--primary-50)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>{exam.time_limit_minutes} دقيقة</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{exam.description}</p>
                      
                      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={() => { setSelectedExamId(exam.id); setShowAddQuestionModal(true); }}
                          className="btn btn-outline" style={{ flex: 1 }}
                        >
                          <PlusCircle size={16} /> إضافة أسئلة
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'homework' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-heading)' }}>الواجبات والمرفقات (PDF)</h3>
                <button onClick={() => setShowAddHomeworkModal(true)} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.25rem' }}>
                  <Plus size={18} /> إضافة واجب جديد
                </button>
              </div>
              
              {homeworks.length === 0 ? (
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <Upload size={48} color="var(--color-border-strong)" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ color: 'var(--color-heading)', fontWeight: 700, marginBottom: '0.5rem' }}>لا توجد واجبات بعد</h4>
                  <p>يمكنك رفع ملفات الواجبات (PDF) لتكون متاحة لطلاب الكورس.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {homeworks.map(hw => (
                    <div key={hw.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-heading)' }}>{hw.title}</h4>
                        {hw.due_date && <span style={{ fontSize: '0.85rem', color: '#b45309', background: '#fef3c7', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>التسليم: {new Date(hw.due_date).toLocaleDateString('ar-EG')}</span>}
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{hw.description}</p>
                      {hw.file_url && (
                        <div style={{ marginTop: '0.5rem' }}>
                           <a href={hw.file_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-600)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                             <FileText size={16} /> تحميل ملف الواجب
                           </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Lecture Modal */}
      {showAddLectureModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 500, padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>رفع محاضرة جديدة</h3>
              <button onClick={() => setShowAddLectureModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateLecture} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">عنوان المحاضرة</label>
                <input type="text" className="form-input" value={lecTitle} onChange={e => setLecTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">رابط الفيديو (YouTube/Vimeo)</label>
                <input type="url" className="form-input" value={lecUrl} onChange={e => setLecUrl(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">الوحدة (اختياري)</label>
                  <input type="text" className="form-input" value={lecUnit} onChange={e => setLecUnit(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">الدرس (اختياري)</label>
                  <input type="text" className="form-input" value={lecLesson} onChange={e => setLecLesson(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">وصف المحاضرة (اختياري)</label>
                <textarea className="form-input" value={lecDesc} onChange={e => setLecDesc(e.target.value)} rows={2} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>حفظ المحاضرة</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddExamModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 500, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>إنشاء امتحان جديد</h3>
              <button onClick={() => setShowAddExamModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateExam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">عنوان الامتحان</label>
                <input type="text" className="form-input" value={examTitle} onChange={e => setExamTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">وصف الامتحان (اختياري)</label>
                <textarea className="form-input" value={examDesc} onChange={e => setExamDesc(e.target.value)} rows={2} />
              </div>
              <div className="form-group">
                <label className="form-label">مدة الامتحان (بالدقائق)</label>
                <input type="number" className="form-input" value={examTime} onChange={e => setExamTime(Number(e.target.value))} required min={5} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>إنشاء الامتحان</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddQuestionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 600, padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>إضافة سؤال للامتحان</h3>
              <button onClick={() => setShowAddQuestionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">السؤال</label>
                <textarea className="form-input" value={qText} onChange={e => setQText(e.target.value)} required rows={3} placeholder="اكتب نص السؤال هنا..." />
              </div>
              
              <div>
                <label className="form-label">الاختيارات (اختر الإجابة الصحيحة من الجانب)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {qOptions.map((opt, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="radio" 
                        name="correctOpt" 
                        checked={qCorrectIdx === idx} 
                        onChange={() => setQCorrectIdx(idx)}
                        style={{ width: 20, height: 20, cursor: 'pointer', accentColor: 'var(--primary-600)' }}
                      />
                      <input 
                        type="text" 
                        className="form-input" 
                        value={opt} 
                        onChange={e => {
                          const newOpts = [...qOptions];
                          newOpts[idx] = e.target.value;
                          setQOptions(newOpts);
                        }} 
                        placeholder={`الاختيار ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>حفظ السؤال</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Homework Modal */}
      {showAddHomeworkModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 500, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>إضافة واجب جديد</h3>
              <button onClick={() => setShowAddHomeworkModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateHomework} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">عنوان الواجب</label>
                <input type="text" className="form-input" value={hwTitle} onChange={e => setHwTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">الوصف (اختياري)</label>
                <textarea className="form-input" value={hwDesc} onChange={e => setHwDesc(e.target.value)} rows={2} />
              </div>
              <div className="form-group">
                <label className="form-label">رابط ملف الـ PDF (اختياري)</label>
                <input type="url" className="form-input" placeholder="https://..." value={hwFileUrl} onChange={e => setHwFileUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">تاريخ التسليم (اختياري)</label>
                <input type="date" className="form-input" value={hwDueDate} onChange={e => setHwDueDate(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>إضافة الواجب</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
