import type { Prediction, Match } from './types'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

export interface UserBadge extends Badge {
  unlockedAt: Date
  progress?: number
  maxProgress?: number
}

export const BADGES: Record<string, Badge> = {
  perfecto: {
    id: 'perfecto',
    name: 'Perfeito',
    description: 'Acertou o placar exato em um jogo',
    icon: '🎯',
    color: 'var(--accent-green)',
    rarity: 'common',
  },
  prophet: {
    id: 'prophet',
    name: 'Profeta',
    description: 'Acertou 5 resultados seguidos',
    icon: '🔮',
    color: 'var(--accent-yellow)',
    rarity: 'rare',
  },
  invencible: {
    id: 'invencible',
    name: 'Invencível',
    description: 'Ficou em primeiro lugar em uma rodada',
    icon: '👑',
    color: '#FFD700',
    rarity: 'epic',
  },
  comeback_king: {
    id: 'comeback_king',
    name: 'Rei do Comeback',
    description: 'Subiu 10 posições em uma rodada',
    icon: '🚀',
    color: '#ff6464',
    rarity: 'rare',
  },
  collector: {
    id: 'collector',
    name: 'Colecionador',
    description: 'Acertou 10 placares exatos',
    icon: '🏆',
    color: '#00d4ff',
    rarity: 'uncommon',
  },
  consistent: {
    id: 'consistent',
    name: 'Consistente',
    description: 'Nunca errou uma rodada inteira (taxa de acerto > 80%)',
    icon: '📈',
    color: '#a855f7',
    rarity: 'rare',
  },
  lucky: {
    id: 'lucky',
    name: 'Sortudo',
    description: 'Ganhou 100 pontos em uma única rodada',
    icon: '🍀',
    color: '#10b981',
    rarity: 'uncommon',
  },
  legend: {
    id: 'legend',
    name: 'Lenda',
    description: 'Acumulou 500 pontos totais',
    icon: '⭐',
    color: '#f59e0b',
    rarity: 'legendary',
  },
}

export function calculateUserBadges(
  predictions: Array<Prediction & { matches?: Match & { rounds?: { name: string; id: string } } }>,
  userId: string
): UserBadge[] {
  const badges: UserBadge[] = []
  const now = new Date()

  // Badge: Perfeito
  const hasExactScore = predictions.some((p) => p.points === 10)
  if (hasExactScore) {
    badges.push({
      ...BADGES.perfecto,
      unlockedAt: now,
    })
  }

  // Badge: Colecionador
  const exactScoreCount = predictions.filter((p) => p.points === 10).length
  if (exactScoreCount >= 10) {
    badges.push({
      ...BADGES.collector,
      unlockedAt: now,
    })
  }

  // Badge: Sortudo
  const roundPoints = new Map<string, number>()
  predictions.forEach((pred) => {
    const match = (pred as { matches?: Match & { rounds?: { name: string } } }).matches
    if (!match?.rounds) return

    const roundName = match.rounds.name
    const current = roundPoints.get(roundName) ?? 0
    roundPoints.set(roundName, current + (pred.points ?? 0))
  })

  const hasLuckyRound = Array.from(roundPoints.values()).some((points) => points >= 100)
  if (hasLuckyRound) {
    badges.push({
      ...BADGES.lucky,
      unlockedAt: now,
    })
  }

  // Badge: Lenda
  const totalPoints = predictions.reduce((sum, p) => sum + (p.points ?? 0), 0)
  if (totalPoints >= 500) {
    badges.push({
      ...BADGES.legend,
      unlockedAt: now,
    })
  }

  // Badge: Profeta (5 acertos seguidos)
  let streak = 0
  let hasProphet = false
  predictions
    .sort((a, b) => {
      const timeA = new Date(a.created_at ?? 0).getTime()
      const timeB = new Date(b.created_at ?? 0).getTime()
      return timeA - timeB
    })
    .forEach((pred) => {
      if ((pred.points ?? 0) >= 5) {
        streak++
        if (streak >= 5) {
          hasProphet = true
        }
      } else {
        streak = 0
      }
    })

  if (hasProphet) {
    badges.push({
      ...BADGES.prophet,
      unlockedAt: now,
    })
  }

  // Badge: Consistente (taxa de acerto > 80%)
  if (predictions.length > 0) {
    const correctResults = predictions.filter((p) => (p.points ?? 0) >= 5).length
    const hitRate = (correctResults / predictions.length) * 100
    if (hitRate > 80) {
      badges.push({
        ...BADGES.consistent,
        unlockedAt: now,
      })
    }
  }

  // Remove duplicates
  const uniqueBadges = Array.from(new Map(badges.map((b) => [b.id, b])).values())

  return uniqueBadges
}
