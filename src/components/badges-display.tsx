'use client'

import type { UserBadge } from '@/lib/badges'

interface Props {
  badges: UserBadge[]
}

const rarityConfig = {
  common: { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)' },
  uncommon: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' },
  rare: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)' },
  epic: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)' },
  legendary: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' },
}

export default function BadgesDisplay({ badges }: Props) {
  if (badges.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl border p-4 lg:p-6 mb-6" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
      <h3 className="font-semibold text-sm lg:text-base mb-4" style={{ color: 'var(--text-primary)' }}>
        🏅 Conquistas ({badges.length})
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {badges.map((badge) => {
          const rarityStyle = rarityConfig[badge.rarity]

          return (
            <div
              key={badge.id}
              className="rounded-lg p-3 lg:p-4 border group cursor-pointer transition-all hover:scale-105"
              style={{
                backgroundColor: rarityStyle.bg,
                borderColor: rarityStyle.border,
              }}
              title={badge.description}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl lg:text-3xl">{badge.icon}</span>
                <div className="text-center">
                  <p className="font-semibold text-xs lg:text-sm" style={{ color: 'var(--text-primary)' }}>
                    {badge.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {badge.rarity === 'common' && '✓ Comum'}
                    {badge.rarity === 'uncommon' && '★ Incomum'}
                    {badge.rarity === 'rare' && '★★ Rara'}
                    {badge.rarity === 'epic' && '★★★ Épica'}
                    {badge.rarity === 'legendary' && '★★★★ Lendária'}
                  </p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bg-black/90 px-3 py-2 rounded text-xs text-white pointer-events-none z-50 whitespace-nowrap">
                {badge.description}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
