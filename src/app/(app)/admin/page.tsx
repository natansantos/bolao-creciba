import { requireAdmin } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function AdminPage() {
  await requireAdmin()

  const admin = createAdminClient()
  const [{ count: roundsCount }, { count: matchesCount }, { count: usersCount }] = await Promise.all([
    admin.from('rounds').select('*', { count: 'exact', head: true }),
    admin.from('matches').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  const cards = [
    { href: '/admin/seed', label: 'Popular Copa 2026', icon: '🌍', count: null, highlight: true },
    { href: '/admin/rounds', label: 'Rodadas', icon: '📅', count: roundsCount ?? 0 },
    { href: '/admin/matches', label: 'Jogos', icon: '🥅', count: matchesCount ?? 0 },
    { href: '/admin/results', label: 'Resultados', icon: '📊', count: null },
    { href: '/ranking', label: 'Participantes', icon: '👥', count: usersCount ?? 0 },
  ]

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-bebas text-4xl mb-1" style={{ color: 'var(--text-primary)' }}>Painel Admin</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Bolão CRECI-BA</p>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border p-4 transition-all hover:border-(--accent-green) group"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: (card as { highlight?: boolean }).highlight ? 'var(--accent-green)' : 'var(--bg-border)',
            }}
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{card.label}</p>
            {card.count !== null && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {card.count} registrados
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
