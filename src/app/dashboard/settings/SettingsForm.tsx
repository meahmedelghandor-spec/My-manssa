'use client'

import { useState } from 'react'
import { updateProfileSettings, updatePasswordSettings } from '@/app/actions/settings'
import { User, Phone, Mail, Lock, BookOpen, Layers } from 'lucide-react'

export default function SettingsForm({ userProfile }: { userProfile: any }) {
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const mainPhone = userProfile?.email?.split('@')[0] || 'غير متوفر'

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProfileLoading(true)
    setMessage({ text: '', type: '' })
    
    const formData = new FormData(e.currentTarget)
    const result = await updateProfileSettings(formData)
    
    setProfileLoading(false)
    if (result.error) {
      setMessage({ text: result.error, type: 'error' })
    } else {
      setMessage({ text: 'تم تحديث البيانات بنجاح', type: 'success' })
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPasswordLoading(true)
    setMessage({ text: '', type: '' })
    
    const formData = new FormData(e.currentTarget)
    const result = await updatePasswordSettings(formData)
    
    setPasswordLoading(false)
    if (result.error) {
      setMessage({ text: result.error, type: 'error' })
    } else {
      setMessage({ text: 'تم تحديث كلمة المرور بنجاح', type: 'success' })
      e.currentTarget.reset()
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {message.text && (
        <div style={{ 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          background: message.type === 'error' ? '#fee2e2' : '#dcfce3', 
          color: message.type === 'error' ? '#991b1b' : '#166534',
          border: `1px solid ${message.type === 'error' ? '#f87171' : '#86efac'}`,
          fontWeight: 600,
          textAlign: 'center'
        }}>
          {message.text}
        </div>
      )}

      {/* Account Settings */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={20} className="text-primary-600" />
          إعدادات الحساب
        </h2>
        
        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="form-group">
            <label className="form-label">الاسم بالكامل (غير قابل للتعديل)</label>
            <input type="text" className="form-input" value={userProfile?.full_name || ''} disabled style={{ background: 'var(--color-bg-muted)', color: 'var(--color-text-muted)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label"><Phone size={16} /> رقم الموبايل الأساسي</label>
              <input type="text" className="form-input" value={mainPhone} disabled style={{ background: 'var(--color-bg-muted)', color: 'var(--color-text-muted)', direction: 'ltr', textAlign: 'right' }} />
            </div>

            <div className="form-group">
              <label className="form-label"><Phone size={16} /> رقم موبايل إضافي (اختياري)</label>
              <input type="text" name="secondaryPhone" className="form-input" defaultValue={userProfile?.secondary_phone || ''} placeholder="01xxxxxxxxx" style={{ direction: 'ltr', textAlign: 'right' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label"><Mail size={16} /> البريد الإلكتروني (اختياري)</label>
            <input type="email" name="contactEmail" className="form-input" defaultValue={userProfile?.contact_email || ''} placeholder="example@email.com" style={{ direction: 'ltr', textAlign: 'right' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
            <div className="form-group">
              <label className="form-label"><BookOpen size={16} /> الصف الدراسي (غير قابل للتعديل)</label>
              <select name="grade" className="form-input" value={userProfile?.grade || 'sec_1'} disabled style={{ background: 'var(--color-bg-muted)', color: 'var(--color-text-muted)', opacity: 0.8 }}>
                <option value="prep_1">الصف الأول الإعدادي</option>
                <option value="prep_2">الصف الثاني الإعدادي</option>
                <option value="prep_3">الصف الثالث الإعدادي</option>
                <option value="sec_1">الصف الأول الثانوي</option>
                <option value="sec_2">الصف الثاني الثانوي</option>
                <option value="sec_3">الصف الثالث الثانوي</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label"><Layers size={16} /> الشعبة (غير قابلة للتعديل)</label>
              <select name="section" className="form-input" value={userProfile?.section || 'arabic'} disabled style={{ background: 'var(--color-bg-muted)', color: 'var(--color-text-muted)', opacity: 0.8 }}>
                <option value="arabic">عربي</option>
                <option value="languages">لغات</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: 'fit-content' }} disabled={profileLoading}>
            {profileLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </form>
      </div>

      {/* Password Settings */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={20} className="text-primary-600" />
          تغيير كلمة المرور
        </h2>
        
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">كلمة المرور الجديدة</label>
            <input type="password" name="password" className="form-input" placeholder="أدخل كلمة المرور الجديدة" required minLength={6} style={{ direction: 'ltr', textAlign: 'right' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>يجب أن تتكون من 6 أحرف أو أرقام على الأقل.</span>
          </div>

          <button type="submit" className="btn btn-outline" style={{ marginTop: '0.5rem', width: 'fit-content' }} disabled={passwordLoading}>
            {passwordLoading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
          </button>
        </form>
      </div>

    </div>
  )
}
