import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Sidebar from '@/components/sidebar'
import BottomNav from '@/components/bottom-nav'
import PwaInstallBanner from '@/components/pwa-install-banner'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      <Sidebar profile={profile} />
      <main className="flex-1 pb-20 md:pb-0 md:ml-60">
        {children}
      </main>
      <BottomNav isAdmin={profile?.is_admin ?? false} />
      <PwaInstallBanner />
    </div>
  )
}
