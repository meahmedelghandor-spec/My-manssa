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
      setSettings((prev: any) => ({ 
        ...prev, 
        ...data,
        footer_settings: data.footer_settings || {
          teacher_info: { name: "الأستاذ احمد الغندور", desc: "خبرة أكثر من 25 سنة في تدريس الفيزياء", email: "me.ahmedelghandor@gmail.com" },
          socialLinks: [
            { label: "الصفحة الرسمية", desc: "أي أخبار تفاصيل، معلومات مهمة هتبلغكم هناك", href: "#" },
            { label: "جروب الطلاب", desc: "لو عندك أي استفسار علمي", href: "#" },
            { label: "جروب الاستراحة", desc: "نفك شوية عن نفسنا من دوشة الفيزياء", href: "#" },
            { label: "يوتيوب", desc: "أي كورس أو محاضرة مجانية أو فيديو توضيحي هينزل هناك", href: "#" },
            { label: "إنستجرام", desc: "أخر التنبيهات والأخبار وصور محاضراتنا", href: "#" },
          ],
          supportLinks: [
            { label: "قناة واتساب", desc: "أي أخبار أو تنبيهات أو معلومات هتنزل هناك", href: "#" },
            { label: "دعم فني – تيليجرام", desc: "عندك مشكلة على المنصة؟ متقلقش هنساعدك فوراً", href: "#" },
            { label: "دعم نفسي – واتساب", desc: "تحديد أفضل طرق المذاكرة وتنظيم الوقت", href: "#", phone: "01507200326" },
          ]
        }
      }));
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

  const handleFooterTeacherInfoChange = (field: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      footer_settings: {
        ...prev.footer_settings,
        teacher_info: { ...prev.footer_settings?.teacher_info, [field]: value }
      }
    }));
  };

  const handleFooterSocialChange = (index: number, field: string, value: string) => {
    const newLinks = [...(settings.footer_settings?.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSettings((prev: any) => ({ ...prev, footer_settings: { ...prev.footer_settings, socialLinks: newLinks } }));
  };

  const handleFooterSupportChange = (index: number, field: string, value: string) => {
    const newLinks = [...(settings.footer_settings?.supportLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSettings((prev: any) => ({ ...prev, footer_settings: { ...prev.footer_settings, supportLinks: newLinks } }));
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

      {/* ── FOOTER SETTINGS ────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>الفوتر وروابط التواصل</h2>
          <button onClick={() => handleSave('footer_settings', settings.footer_settings)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
            {saving === 'footer_settings' ? <CheckCircle size={16} /> : <Save size={16} />} حفظ التعديلات
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Teacher Info */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-heading)' }}>معلومات المعلم</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <div className="form-group">
                <label className="form-label">الاسم</label>
                <input type="text" className="form-input" value={settings.footer_settings?.teacher_info?.name || ''} onChange={e => handleFooterTeacherInfoChange('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">الوصف</label>
                <input type="text" className="form-input" value={settings.footer_settings?.teacher_info?.desc || ''} onChange={e => handleFooterTeacherInfoChange('desc', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني / الرابط</label>
                <input type="text" className="form-input" value={settings.footer_settings?.teacher_info?.email || ''} onChange={e => handleFooterTeacherInfoChange('email', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-heading)' }}>روابط السوشيال ميديا</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {settings.footer_settings?.socialLinks?.map((link: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{flex: '1 1 200px'}}>
                    <label className="form-label">الاسم ({link.label})</label>
                    <input type="text" className="form-input" value={link.label} onChange={e => handleFooterSocialChange(i, 'label', e.target.value)} />
                  </div>
                  <div style={{flex: '1 1 200px'}}>
                    <label className="form-label">الرابط (Link)</label>
                    <input type="text" className="form-input" value={link.href} onChange={e => handleFooterSocialChange(i, 'href', e.target.value)} dir="ltr" />
                  </div>
                  <div style={{flex: '1 1 100%'}}>
                    <label className="form-label">الوصف</label>
                    <input type="text" className="form-input" value={link.desc} onChange={e => handleFooterSocialChange(i, 'desc', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-heading)' }}>أرقام وروابط الدعم</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {settings.footer_settings?.supportLinks?.map((link: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{flex: '1 1 200px'}}>
                    <label className="form-label">الاسم ({link.label})</label>
                    <input type="text" className="form-input" value={link.label} onChange={e => handleFooterSupportChange(i, 'label', e.target.value)} />
                  </div>
                  <div style={{flex: '1 1 200px'}}>
                    <label className="form-label">الرابط (Link)</label>
                    <input type="text" className="form-input" value={link.href} onChange={e => handleFooterSupportChange(i, 'href', e.target.value)} dir="ltr" />
                  </div>
                  <div style={{flex: '1 1 200px'}}>
                    <label className="form-label">رقم الهاتف (اختياري)</label>
                    <input type="text" className="form-input" value={link.phone || ''} onChange={e => handleFooterSupportChange(i, 'phone', e.target.value)} dir="ltr" />
                  </div>
                  <div style={{flex: '1 1 100%'}}>
                    <label className="form-label">الوصف</label>
                    <input type="text" className="form-input" value={link.desc} onChange={e => handleFooterSupportChange(i, 'desc', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
