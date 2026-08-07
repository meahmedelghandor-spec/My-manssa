'use client';
// Force rebuild for Turbopack

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CreditCard, UploadCloud, ChevronLeft, Phone, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { submitEnrollment } from '@/app/actions/enrollment';

export default function EnrollPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [course, setCourse] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // These should ideally come from database settings, hardcoded for now as per plan
  const PAYMENT_DETAILS = {
    wallet: '01000000000',
    instapay: 'teacher_instapay@instapay'
  };

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    if (!id) return;
    const supabase = createClient();
    const { data } = await supabase.from('courses').select('*').eq('id', id).single();
    if (data) setCourse(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setErrorMsg('يرجى إرفاق صورة إيصال التحويل');
      return;
    }
    if (!paymentNumber) {
      setErrorMsg('يرجى كتابة رقم الموبايل أو حساب إنستاباي الذي قمت بالتحويل منه');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const supabase = createClient();
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(filePath, imageFile);
      
    if (uploadError) {
      setErrorMsg("خطأ في رفع صورة الإيصال: " + uploadError.message);
      setIsSubmitting(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('receipts')
      .getPublicUrl(filePath);

    const res = await submitEnrollment({
      course_id: id,
      payment_method: paymentMethod,
      payment_number: paymentNumber,
      receipt_url: publicUrl
    });

    if (res?.error) {
      setErrorMsg(res.error);
      setIsSubmitting(false);
    } else {
      router.push('/dashboard/lectures');
    }
  };

  if (!course) return <div style={{ padding: '2rem', textAlign: 'center' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '2rem 1.25rem', maxWidth: 600, margin: '0 auto', minHeight: '100dvh' }}>
      
      <Link href="/dashboard/lectures" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', textDecoration: 'none' }}>
        <ChevronLeft size={16} /> العودة للكورسات
      </Link>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary-600)' }}>
            <CreditCard size={32} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>اشتراك في الكورس</h1>
          <p style={{ color: 'var(--primary-700)', fontWeight: 700, fontSize: '1.1rem' }}>{course.title}</p>
          <div style={{ display: 'inline-block', background: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.25rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 800, marginTop: '0.5rem', border: '1px solid var(--primary-200)' }}>
            قيمة الاشتراك: {course.price} ج.م
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', border: '1px solid #fecaca', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>1. اختر طريقة الدفع</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div 
                onClick={() => setPaymentMethod('wallet')}
                style={{ padding: '1rem', border: `2px solid ${paymentMethod === 'wallet' ? 'var(--primary-500)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: paymentMethod === 'wallet' ? 'var(--primary-50)' : 'transparent', transition: 'all 0.2s' }}
              >
                <div style={{ fontWeight: 800, marginBottom: '0.25rem', color: paymentMethod === 'wallet' ? 'var(--primary-700)' : 'var(--color-text)' }}>محفظة إلكترونية</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>(فودافون كاش، اتصالات، أورانج)</div>
              </div>
              <div 
                onClick={() => setPaymentMethod('instapay')}
                style={{ padding: '1rem', border: `2px solid ${paymentMethod === 'instapay' ? 'var(--primary-500)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center', background: paymentMethod === 'instapay' ? 'var(--primary-50)' : 'transparent', transition: 'all 0.2s' }}
              >
                <div style={{ fontWeight: 800, marginBottom: '0.25rem', color: paymentMethod === 'instapay' ? 'var(--primary-700)' : 'var(--color-text)' }}>إنستاباي</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>InstaPay</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
            <p style={{ fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>قم بتحويل مبلغ {course.price} ج.م إلى:</p>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} dir="ltr">
              <Phone size={20} />
              {paymentMethod === 'wallet' ? PAYMENT_DETAILS.wallet : PAYMENT_DETAILS.instapay}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>2. بيانات التحويل الخاص بك</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder={paymentMethod === 'wallet' ? "رقم الموبايل الذي حولت منه" : "عنوان حساب إنستاباي الخاص بك"} 
              value={paymentNumber} 
              onChange={(e) => setPaymentNumber(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700 }}>3. إرفاق إيصال الدفع (سكرين شوت)</label>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: imageFile ? 'var(--primary-50)' : 'transparent', borderColor: imageFile ? 'var(--primary-500)' : 'var(--color-border)', transition: 'all 0.2s' }}>
              <UploadCloud size={32} color={imageFile ? 'var(--primary-500)' : 'var(--color-text-muted)'} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 600, color: imageFile ? 'var(--primary-700)' : 'var(--color-text)' }}>
                {imageFile ? imageFile.name : 'اضغط هنا لرفع صورة الإيصال'}
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files && setImageFile(e.target.files[0])} required />
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius-md)', marginTop: '1rem', justifyContent: 'center' }} disabled={isSubmitting}>
            {isSubmitting ? 'جاري الإرسال...' : 'تأكيد إرسال الطلب'}
          </button>

        </form>
      </div>
    </div>
  );
}
