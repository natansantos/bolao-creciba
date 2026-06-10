'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Jogos', icon: '⚽' },
  { href: '/ranking', label: 'Ranking', icon: '🏆' },
  { href: '/history', label: 'Histórico', icon: '📋' },
]

export default function BottomNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()

  const items = isAdmin
    ? [...navItems, { href: '/admin', label: 'Admin', icon: '⚙️' }]
    : navItems

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 border-t z-10"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
    >
      <div className="flex">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition-colors"
              style={{ color: active ? 'var(--accent-green)' : 'var(--text-muted)' }}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
