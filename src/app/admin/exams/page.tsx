'use client';

import { FileText, Plus, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function AdminExamsPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.75rem', color: 'var(--color-heading)', marginBottom: '0.25rem' }}>
            الامتحانات
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>إدارة وإنشاء امتحانات شاملة للطلاب</p>
        </div>
        <Link href="/admin/courses" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-full)' }}>
          <BookOpen size={18} /> الذهاب لإدارة الكورسات
        </Link>
      </div>

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <FileText size={64} color="var(--color-border-strong)" style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
          لا توجد امتحانات حتى الآن
        </h2>
        <p style={{ maxWidth: 500, margin: '0 auto' }}>
          ستظهر هنا الامتحانات العامة التي تنشئها. لإنشاء امتحانات خاصة بكورس معين، قم بإنشائها من داخل صفحة إدارة الكورس.
        </p>
      </div>
    </div>
  );
}
