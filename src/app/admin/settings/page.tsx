'use client';

import { useState } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.75rem', color: 'var(--color-heading)', marginBottom: '0.25rem' }}>
            إعدادات المنصة
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>التحكم في بيانات وإعدادات المنصة الأساسية</p>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 600 }}>
          <div className="form-group">
            <label className="form-label">اسم المنصة</label>
            <input type="text" className="form-input" defaultValue="منصة الفيزياء" />
          </div>

          <div className="form-group">
            <label className="form-label">رقم هاتف الدعم الفني</label>
            <input type="tel" className="form-input" placeholder="مثال: 01000000000" />
          </div>

          <div className="form-group">
            <label className="form-label">رابط صفحة فيسبوك</label>
            <input type="url" className="form-input" placeholder="https://facebook.com/..." />
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', margin: '1rem 0' }} />

          <button onClick={handleSave} className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.8rem 2rem', borderRadius: 'var(--radius-full)' }}>
            {saved ? <CheckCircle size={18} /> : <Save size={18} />} 
            {saved ? 'تم الحفظ بنجاح!' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>
    </div>
  );
}
