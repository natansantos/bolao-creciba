import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import PushNotificationManager from '@/components/push-notification-manager'
import NotificationPrefsForm from '@/components/notification-prefs-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('notify_deadline, notify_result, notify_round_summary')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="font-bebas text-3xl mb-6" style={{ color: 'var(--accent-green)' }}>
        Configurações
      </h1>

      {/* Push notifications */}
      <section
        className="rounded-xl p-5 mb-4"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
          Notificações push
        </h2>
        <PushNotificationManager />
      </section>

      {/* Notification preferences */}
      <section
        className="rounded-xl p-5"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-border)' }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
          O que receber
        </h2>
        <NotificationPrefsForm
          notifyDeadline={profile?.notify_deadline ?? true}
          notifyResult={profile?.notify_result ?? true}
          notifyRoundSummary={profile?.notify_round_summary ?? true}
        />
      </section>
    </div>
  )
}
