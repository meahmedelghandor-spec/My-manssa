import Link from 'next/link';

export default function PlaceholderPage() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2rem', color: 'var(--color-heading)', marginBottom: '1rem' }}>
        هذه الصفحة قيد التطوير
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: 400 }}>
        نعمل حالياً على تجهيز هذه الميزة لتكون متاحة قريباً بأفضل شكل ممكن!
      </p>
      <Link href='/dashboard' className='btn btn-primary' style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)' }}>
        العودة للرئيسية
      </Link>
    </div>
  );
}
