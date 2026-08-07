'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock, Search, Image as ImageIcon, ExternalLink, ShieldCheck } from 'lucide-react';
import { getAdminEnrollments, updateEnrollmentStatus } from '@/app/actions/enrollment';

export default function AdminPaymentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    const data = await getAdminEnrollments();
    setEnrollments(data);
    setIsLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: 'active' | 'rejected') => {
    // Optimistic update
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    const res = await updateEnrollmentStatus(id, status);
    if (res?.error) {
      alert(res.error);
      fetchEnrollments(); // Revert
    }
  };

  const filtered = enrollments.filter(e => {
    if (filter !== 'all' && e.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.student?.full_name?.toLowerCase().includes(q) ||
        e.course?.title?.toLowerCase().includes(q) ||
        e.payment_number?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={14} /> تم التفعيل</span>;
      case 'rejected': return <span style={{ background: '#fef2f2', color: '#ef4444', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><XCircle size={14} /> مرفوض</span>;
      case 'pending': return <span style={{ background: '#fffbeb', color: '#d97706', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> قيد المراجعة</span>;
      default: return null;
    }
  };

  const getGradeLabel = (gId: string) => {
    const grades: Record<string, string> = {
      prep_1: 'الأول الإعدادي', prep_2: 'الثاني الإعدادي', prep_3: 'الثالث الإعدادي',
      sec_1: 'الأول الثانوي', sec_2: 'الثاني الثانوي', sec_3: 'الثالث الثانوي'
    };
    return grades[gId] || gId;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.75rem', color: 'var(--color-heading)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CreditCard size={28} color="var(--primary-500)" />
            إدارة المدفوعات والاشتراكات
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>راجع إيصالات التحويل وقم بتفعيل الكورسات للطلاب</p>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-bg)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-surface)', padding: '0.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            {(['all', 'pending', 'active', 'rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all var(--transition-fast)',
                  background: filter === f ? 'var(--primary-500)' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--color-text-muted)'
                }}
              >
                {f === 'all' ? 'الكل' : f === 'pending' ? 'قيد المراجعة' : f === 'active' ? 'مفعلة' : 'مرفوضة'}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '0.9rem', color: 'var(--color-text-muted)' }} />
            <input type="text" className="form-input" placeholder="ابحث باسم الطالب أو رقم التحويل..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingInlineStart: '2.5rem', height: 40 }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>الطالب</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>الكورس المطلوب</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>بيانات الدفع</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>الحالة</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, borderBottom: '1px solid var(--color-border)', width: 150 }}>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>جاري التحميل...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <ShieldCheck size={48} color="var(--color-border-strong)" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>لا توجد طلبات هنا</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>الطلبات التي تتطابق مع بحثك ستظهر هنا.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((enr) => (
                  <tr key={enr.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }} className="hover-row">
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-heading)' }}>{enr.student?.full_name || 'بدون اسم'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{getGradeLabel(enr.student?.grade)}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '0.9rem' }}>{enr.course?.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>السعر: {enr.course?.price > 0 ? `${enr.course.price} ج.م` : 'مجاني'}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{enr.payment_method === 'instapay' ? 'إنستاباي' : 'محفظة إلكترونية'}:</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-heading)' }} dir="ltr">{enr.payment_number}</span>
                      </div>
                      {enr.receipt_url && (
                        <button onClick={() => setSelectedImage(enr.receipt_url)} style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', padding: 0 }}>
                          <ImageIcon size={14} /> عرض الإيصال
                        </button>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {getStatusBadge(enr.status)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {enr.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleUpdateStatus(enr.id, 'active')} className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', flex: 1, justifyContent: 'center' }}>تفعيل</button>
                          <button onClick={() => handleUpdateStatus(enr.id, 'rejected')} className="btn btn-ghost" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', border: '1px solid #fca5a5' }}>رفض</button>
                        </div>
                      )}
                      {enr.status === 'rejected' && (
                        <button onClick={() => handleUpdateStatus(enr.id, 'active')} className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', width: '100%', justifyContent: 'center' }}>إعادة تفعيل</button>
                      )}
                      {enr.status === 'active' && (
                        <button onClick={() => handleUpdateStatus(enr.id, 'rejected')} className="btn btn-ghost" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', width: '100%', justifyContent: 'center', color: '#ef4444' }}>إلغاء التفعيل</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedImage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setSelectedImage(null)}>
          <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
            <img src={selectedImage} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 'var(--radius-lg)' }} onClick={e => e.stopPropagation()} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
              <a href={selectedImage} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={e => e.stopPropagation()}>
                <ExternalLink size={16} style={{ marginInlineEnd: '0.5rem' }} /> فتح في نافذة جديدة
              </a>
              <button className="btn btn-ghost" style={{ background: '#fff', color: '#000' }} onClick={() => setSelectedImage(null)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hover-row:hover { background: var(--primary-50); }
      `}</style>
    </div>
  );
}
