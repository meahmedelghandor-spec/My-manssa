'use client';

import { Video, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function AdminLecturesPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.75rem', color: 'var(--color-heading)', marginBottom: '0.25rem' }}>
            المحاضرات والمحتوى
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>إدارة كل المحاضرات في مكان واحد</p>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Video size={64} color="var(--primary-300)" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-heading)', marginBottom: '1rem' }}>
          تم نقل إدارة المحاضرات إلى داخل الكورسات!
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: 600, lineHeight: 1.6, marginBottom: '2rem' }}>
          لتنظيم المحتوى بشكل أفضل وتسهيل تجربة الطلاب، أصبح يتم رفع وإدارة المحاضرات، الامتحانات، والواجبات من خلال لوحة تحكم خاصة بكل كورس على حدة.
        </p>
        <Link href="/admin/courses" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
          <BookOpen size={20} /> الذهاب لإدارة الكورسات
        </Link>
      </div>
    </div>
  );
}
