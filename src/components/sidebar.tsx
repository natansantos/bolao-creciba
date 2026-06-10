'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/lib/actions/auth'
import type { Profile } from '@/lib/types'

const navItems = [
  { href: '/how-it-works', label: 'Como Funciona', icon: '📚' },
  { href: '/predictions', label: 'Palpites', icon: '⚽' },
  { href: '/ranking', label: 'Ranking', icon: '🏆' },
  { href: '/history', label: 'Histórico', icon: '📋' },
]

const adminItems = [
  { href: '/admin', label: 'Admin', icon: '⚙️' },
  { href: '/admin/rounds', label: 'Rodadas', icon: '📅' },
  { href: '/admin/matches', label: 'Jogos', icon: '🥅' },
  { href: '/admin/results', label: 'Resultados', icon: '📊' },
]

export default function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 border-r z-10"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
    >
      <div className="p-6 border-b" style={{ borderColor: 'var(--bg-border)' }}>
        <h1 className="font-bebas text-3xl" style={{ color: 'var(--accent-green)' }}>
          PALPITEIROS
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Copa do Mundo 2026</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? 'rgba(0,230,118,0.1)' : 'transparent',
                color: active ? 'var(--accent-green)' : 'var(--text-muted)',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}

        {profile?.is_admin && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs font-semibold uppercase tracking-wider px-3" style={{ color: 'var(--text-muted)' }}>
                Admin
              </p>
            </div>
            {adminItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: active ? 'rgba(255,214,0,0.1)' : 'transparent',
                    color: active ? 'var(--accent-yellow)' : 'var(--text-muted)',
                  }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: 'var(--bg-border)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'var(--bg-base)', color: 'var(--accent-green)' }}
          >
            {profile?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {profile?.name ?? 'Usuário'}
            </p>
            {profile?.is_admin && (
              <p className="text-xs" style={{ color: 'var(--accent-yellow)' }}>Admin</p>
            )}
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-sm py-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--bg-border)' }}
          >
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
