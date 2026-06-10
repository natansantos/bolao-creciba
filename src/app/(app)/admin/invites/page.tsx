import { requireAdmin } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { createInviteAction } from '@/lib/actions/admin'
import CopyButton from '@/components/copy-button'

export default async function InvitesPage() {
  await requireAdmin()

  const admin = createAdminClient()
  const { data: invites } = await admin
    .from('invite_links')
    .select('*, profiles!invite_links_used_by_fkey(name)')
    .order('created_at', { ascending: false })
    .limit(20)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-bebas text-4xl mb-1" style={{ color: 'var(--text-primary)' }}>Convites</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Gere links para novos participantes</p>

      <form action={createInviteAction} className="mb-6">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
        >
          + Gerar novo convite (24h)
        </button>
      </form>

      <div className="space-y-3">
        {(invites ?? []).map((invite) => {
          const expired = new Date(invite.expires_at) < new Date()
          const link = `${baseUrl}/register?token=${invite.token}`
          const usedBy = (invite as { profiles?: { name: string } }).profiles

          return (
            <div
              key={invite.id}
              className="rounded-xl border p-4"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: invite.used ? 'var(--bg-border)' : expired ? 'rgba(255,100,100,0.3)' : 'var(--accent-green)',
                opacity: invite.used || expired ? 0.6 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <code
                    className="text-xs break-all"
                    style={{ color: invite.used || expired ? 'var(--text-muted)' : 'var(--accent-green)' }}
                  >
                    {link}
                  </code>
                </div>
                {!invite.used && !expired && (
                  <CopyButton text={link} />
                )}
              </div>
              <div className="flex gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Expira: {new Date(invite.expires_at).toLocaleString('pt-BR')}</span>
                {invite.used && <span style={{ color: 'var(--accent-yellow)' }}>✓ Usado por {usedBy?.name ?? 'alguém'}</span>}
                {!invite.used && expired && <span className="text-red-400">✕ Expirado</span>}
                {!invite.used && !expired && <span style={{ color: 'var(--accent-green)' }}>● Ativo</span>}
              </div>
            </div>
          )
        })}

        {(!invites || invites.length === 0) && (
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Nenhum convite gerado ainda.
          </p>
        )}
      </div>
    </div>
  )
}

