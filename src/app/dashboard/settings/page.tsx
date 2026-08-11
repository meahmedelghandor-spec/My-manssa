import { getUserProfile } from '@/app/actions/auth'
import SettingsForm from './SettingsForm'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'الإعدادات | المنصة',
}

export default async function SettingsPage() {
  const profile = await getUserProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.8rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
          الإعدادات
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          إدارة تفاصيل حسابك ومعلوماتك الدراسية وتحديث كلمة المرور
        </p>
      </div>

      <SettingsForm userProfile={profile} />
    </div>
  )
}
