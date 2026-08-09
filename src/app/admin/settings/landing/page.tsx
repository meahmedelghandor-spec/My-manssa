'use client';

import { useState, useEffect } from 'react';
import { getLandingSettings, updateLandingSetting } from '@/app/actions/landing';
import { Save, CheckCircle, Plus, Trash2 } from 'lucide-react';

export default function LandingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>({
    top_students_2026: [],
    top_students_2025: [],
    countdown_timer: { targetDate: "", titlePart1: "", titleHighlight: "", titlePart2: "", subtitle: "", visible: true },
    packages: []
  });

  useEffect(() => {
    getLandingSettings().then((data) => {
      setSettings((prev: any) => ({ ...prev, ...data }));
      setLoading(false);
    });
  }, []);

  const handleSave = async (key: string, value: any) => {
    setSaving(key);
    await updateLandingSetting(key, value);
    setTimeout(() => setSaving(null), 1000);
  };

  const handleStudentChange = (year: '2026' | '2025', index: number, field: string, value: any) => {
    const key = `top_students_${year}`;
    const newStudents = [...settings[key]];
    newStudents[index] = { ...newStudents[index], [field]: value };
    setSettings((prev: any) => ({ ...prev, [key]: newStudents }));
  };

  const addStudent = (year: '2026' | '2025') => {
    const key = `top_students_${year}`;
    setSettings((prev: any) => ({
      ...prev,
      [key]: [...prev[key], { name: "", rank: "", batch: `دفعة ${year}`, score: "", rankNum: prev[key].length + 1 }]
    }));
  };

  const removeStudent = (year: '2026' | '2025', index: number) => {
    const key = `top_students_${year}`;
    const newStudents = [...settings[key]];
    newStudents.splice(index, 1);
    setSettings((prev: any) => ({ ...prev, [key]: newStudents }));
  };

  const handlePackageChange = (index: number, field: string, value: any) => {
    const newPackages = [...settings.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setSettings((prev: any) => ({ ...prev, packages: newPackages }));
  };

  const addPackage = () => {
    setSettings((prev: any) => ({
      ...prev,
      packages: [...prev.packages, { id: `pkg_${Date.now()}`, name: "", label: "", badge: "", color: "#6366f1", available: false }]
    }));
  };

  const removePackage = (index: number) => {
    const newPackages = [...settings.packages];
    newPackages.splice(index, 1);
    setSettings((prev: any) => ({ ...prev, packages: newPackages }));
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.75rem', color: 'var(--color-heading)' }}>
          إعدادات الصفحة الرئيسية
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>إدارة محتوى أوائل الجمهورية، العداد التنازلي، والباقات.</p>
      </div>

      {/* ── COUNTDOWN TIMER ────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>العداد التنازلي</h2>
          <button onClick={() => handleSave('countdown_timer', settings.countdown_timer)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
            {saving === 'countdown_timer' ? <CheckCircle size={16} /> : <Save size={16} />}
            حفظ العداد
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">تاريخ الانتهاء</label>
            <input type="datetime-local" className="form-input" value={settings.countdown_timer?.targetDate || ''} onChange={e => setSettings((p: any) => ({...p, countdown_timer: {...p.countdown_timer, targetDate: e.target.value}}))} />
          </div>
          <div className="form-group">
            <label className="form-label">النص الأول</label>
            <input type="text" className="form-input" value={settings.countdown_timer?.titlePart1 || ''} onChange={e => setSettings((p: any) => ({...p, countdown_timer: {...p.countdown_timer, titlePart1: e.target.value}}))} />
          </div>
          <div className="form-group">
            <label className="form-label">النص المميز (ملون)</label>
            <input type="text" className="form-input" value={settings.countdown_timer?.titleHighlight || ''} onChange={e => setSettings((p: any) => ({...p, countdown_timer: {...p.countdown_timer, titleHighlight: e.target.value}}))} />
          </div>
          <div className="form-group">
            <label className="form-label">النص الثاني</label>
            <input type="text" className="form-input" value={settings.countdown_timer?.titlePart2 || ''} onChange={e => setSettings((p: any) => ({...p, countdown_timer: {...p.countdown_timer, titlePart2: e.target.value}}))} />
          </div>
          <div className="form-group">
            <label className="form-label">النص الفرعي</label>
            <input type="text" className="form-input" value={settings.countdown_timer?.subtitle || ''} onChange={e => setSettings((p: any) => ({...p, countdown_timer: {...p.countdown_timer, subtitle: e.target.value}}))} />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <input type="checkbox" checked={settings.countdown_timer?.visible} onChange={e => setSettings((p: any) => ({...p, countdown_timer: {...p.countdown_timer, visible: e.target.checked}}))} />
              إظهار العداد في الصفحة الرئيسية
            </label>
          </div>
        </div>
      </section>

      {/* ── TOP STUDENTS 2026 ────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>أوائل 2026</h2>
          <button onClick={() => handleSave('top_students_2026', settings.top_students_2026)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
            {saving === 'top_students_2026' ? <CheckCircle size={16} /> : <Save size={16} />} حفظ الطلاب
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {settings.top_students_2026?.map((student: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{flex:1}}>
                <label className="form-label">الاسم</label>
                <input type="text" className="form-input" value={student.name} onChange={e => handleStudentChange('2026', i, 'name', e.target.value)} />
              </div>
              <div style={{flex:1}}>
                <label className="form-label">المركز</label>
                <input type="text" className="form-input" value={student.rank} onChange={e => handleStudentChange('2026', i, 'rank', e.target.value)} />
              </div>
              <div style={{width: 80}}>
                <label className="form-label">رقم المركز</label>
                <input type="number" className="form-input" value={student.rankNum} onChange={e => handleStudentChange('2026', i, 'rankNum', Number(e.target.value))} />
              </div>
              <button onClick={() => removeStudent('2026', i)} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444', padding: '0.75rem' }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button onClick={() => addStudent('2026')} className="btn btn-outline" style={{ borderStyle: 'dashed', width: '100%' }}>
            <Plus size={16} /> إضافة طالب جديد
          </button>
        </div>
      </section>

      {/* ── TOP STUDENTS 2025 ────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>أوائل 2025</h2>
          <button onClick={() => handleSave('top_students_2025', settings.top_students_2025)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
            {saving === 'top_students_2025' ? <CheckCircle size={16} /> : <Save size={16} />} حفظ الطلاب
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {settings.top_students_2025?.map((student: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{flex:1}}>
                <label className="form-label">الاسم</label>
                <input type="text" className="form-input" value={student.name} onChange={e => handleStudentChange('2025', i, 'name', e.target.value)} />
              </div>
              <div style={{flex:1}}>
                <label className="form-label">المركز</label>
                <input type="text" className="form-input" value={student.rank} onChange={e => handleStudentChange('2025', i, 'rank', e.target.value)} />
              </div>
              <div style={{width: 80}}>
                <label className="form-label">رقم المركز</label>
                <input type="number" className="form-input" value={student.rankNum} onChange={e => handleStudentChange('2025', i, 'rankNum', Number(e.target.value))} />
              </div>
              <button onClick={() => removeStudent('2025', i)} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444', padding: '0.75rem' }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button onClick={() => addStudent('2025')} className="btn btn-outline" style={{ borderStyle: 'dashed', width: '100%' }}>
            <Plus size={16} /> إضافة طالب جديد
          </button>
        </div>
      </section>

      {/* ── PACKAGES ────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>الباقات والعروض</h2>
          <button onClick={() => handleSave('packages', settings.packages)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
            {saving === 'packages' ? <CheckCircle size={16} /> : <Save size={16} />} حفظ الباقات
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {settings.packages?.map((pkg: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{flex: '1 1 150px'}}>
                <label className="form-label">اسم الباقة (مختصر)</label>
                <input type="text" className="form-input" value={pkg.name} onChange={e => handlePackageChange(i, 'name', e.target.value)} />
              </div>
              <div style={{flex: '1 1 150px'}}>
                <label className="form-label">عنوان التبويبة</label>
                <input type="text" className="form-input" value={pkg.label} onChange={e => handlePackageChange(i, 'label', e.target.value)} />
              </div>
              <div style={{flex: '1 1 150px'}}>
                <label className="form-label">النص المميز (Badge)</label>
                <input type="text" className="form-input" value={pkg.badge || ''} onChange={e => handlePackageChange(i, 'badge', e.target.value)} placeholder="مثل: الأوفر" />
              </div>
              <div style={{flex: '1 1 120px'}}>
                <label className="form-label" style={{display:'block'}}>الحالة</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.65rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <input type="checkbox" checked={pkg.available} onChange={e => handlePackageChange(i, 'available', e.target.checked)} />
                  متاحة؟
                </label>
              </div>
              <button onClick={() => removePackage(i)} className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444', padding: '0.75rem', marginTop: '1.7rem' }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button onClick={addPackage} className="btn btn-outline" style={{ borderStyle: 'dashed', width: '100%' }}>
            <Plus size={16} /> إضافة باقة جديدة
          </button>
        </div>
      </section>

    </div>
  );
}
