'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { RoundLeaderboard } from '@/lib/stats'

export async function getRoundLeaderboard(roundId: string): Promise<RoundLeaderboard[]> {
  const admin = createAdminClient()

  const { data: predictions } = await admin
    .from('predictions')
    .select(`
      user_id,
      points,
      home_score_pred,
      away_score_pred,
      matches (
        round_id,
        home_score,
        away_score
      )
    `)
    .eq('matches.round_id', roundId)

  if (!predictions || predictions.length === 0) {
    return []
  }

  const { data: profiles } = await admin
    .from('profiles')
    .select('id, name')

  const profileMap = new Map(profiles?.map((p) => [p.id, p.name]) ?? [])

  const roundLeaderboard = new Map<string, { points: number; exactScores: number; correctResults: number }>()

  predictions.forEach((pred) => {
    const userId = pred.user_id
    if (!userId) return

    if (!roundLeaderboard.has(userId)) {
      roundLeaderboard.set(userId, { points: 0, exactScores: 0, correctResults: 0 })
    }

    const entry = roundLeaderboard.get(userId)!
    entry.points += pred.points ?? 0

    if (pred.points === 10) {
      entry.exactScores++
    } else if ((pred.points ?? 0) >= 5) {
      entry.correctResults++
    }
  })

  const leaderboard: RoundLeaderboard[] = Array.from(roundLeaderboard.entries())
    .map(([userId, stats]) => ({
      userId,
      name: profileMap.get(userId) ?? 'Usuário',
      roundPoints: stats.points,
      exactScores: stats.exactScores,
      correctResults: stats.correctResults,
    }))
    .sort((a, b) => b.roundPoints - a.roundPoints)

  return leaderboard
}

export async function getCurrentRound(): Promise<{ id: string; name: string } | null> {
  const admin = createAdminClient()

  const { data: round } = await admin
    .from('rounds')
    .select('id, name')
    .eq('status', 'open')
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  return round ?? null
}

export async function getUserPointsEvolution(userId: string): Promise<Array<{ roundName: string; points: number }>> {
  const admin = createAdminClient()

  const { data: predictions } = await admin
    .from('predictions')
    .select(`
      points,
      matches (
        rounds (name)
      )
    `)
    .eq('user_id', userId)

  if (!predictions || predictions.length === 0) {
    return []
  }

  const roundMap = new Map<string, number>()

  predictions.forEach((pred) => {
    const match = (pred as { matches?: { rounds?: { name: string } } }).matches
    if (!match?.rounds) return

    const roundName = match.rounds.name
    const currentPoints = roundMap.get(roundName) ?? 0
    roundMap.set(roundName, currentPoints + (pred.points ?? 0))
  })

  return Array.from(roundMap.entries())
    .map(([roundName, points]) => ({ roundName, points }))
    .sort((a, b) => a.roundName.localeCompare(b.roundName))
}
