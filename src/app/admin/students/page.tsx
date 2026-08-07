'use client';

import { useState, useEffect } from 'react';
import { Users, Search, MoreVertical } from 'lucide-react';
import { getAdminStudents } from '@/app/actions/student';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStudents().then(res => {
      if (res.data) setStudents(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = search
    ? students.filter(s => s.full_name?.includes(search) || s.email?.includes(search) || s.phone?.includes(search))
    : students;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.75rem', color: 'var(--color-heading)', marginBottom: '0.25rem' }}>
            الطلاب
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>إدارة حسابات وبيانات الطلاب المشتركين</p>
        </div>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
          <Search size={18} style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="form-input" placeholder="ابحث عن طالب بالاسم أو الإيميل..." style={{ paddingRight: '2.5rem', borderRadius: 'var(--radius-full)' }} />
        </div>
      </div>

      {loading ? (
         <div style={{ textAlign: 'center', padding: '4rem' }}>جاري التحميل...</div>
      ) : students.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <Users size={64} color="var(--color-border-strong)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
            لا توجد بيانات للطلاب
          </h2>
          <p style={{ maxWidth: 500, margin: '0 auto' }}>
            بمجرد تسجيل الطلاب في المنصة، ستظهر حساباتهم هنا لتتمكن من إدارتها ومتابعة نشاطهم.
          </p>
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead style={{ background: 'var(--color-bg)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>الاسم</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>البريد الإلكتروني</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>رقم الهاتف</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>المرحلة / القسم</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(student => (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{student.full_name || 'بدون اسم'}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{student.email || '-'}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{student.phone || '-'}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {student.grade === 'prep_1' && 'أولى إعدادي'}
                      {student.grade === 'prep_2' && 'ثانية إعدادي'}
                      {student.grade === 'prep_3' && 'ثالثة إعدادي'}
                      {student.grade === 'sec_1' && 'أولى ثانوي'}
                      {student.grade === 'sec_2' && 'ثانية ثانوي'}
                      {student.grade === 'sec_3' && 'ثالثة ثانوي'}
                      {' - '}
                      {student.section === 'languages' ? 'لغات' : 'عربي'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
