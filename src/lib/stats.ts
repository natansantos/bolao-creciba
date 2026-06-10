import type { Prediction, Match } from './types'

export interface UserStats {
  totalPredictions: number
  totalPoints: number
  exactScores: number
  correctResults: number
  hitRate: number
  pointsPerMatch: number
  favoriteTeams: Array<{ team: string; accuracy: number }>
  pointsByRound: Array<{ roundId: string; roundName: string; points: number }>
}

export interface RoundLeaderboard {
  userId: string
  name: string
  roundPoints: number
  exactScores: number
  correctResults: number
}

export interface PointsEvolution {
  roundName: string
  totalPoints: number
  cumulativePoints: number
}

export async function calculateUserStats(
  predictions: Array<Prediction & { matches?: Match & { rounds?: { name: string } } }>,
  userId: string
): Promise<UserStats> {
  const totalPredictions = predictions.length
  const totalPoints = predictions.reduce((sum, p) => sum + (p.points ?? 0), 0)
  const exactScores = predictions.filter((p) => p.points === 10).length
  const correctResults = predictions.filter((p) => (p.points ?? 0) >= 5).length
  const hitRate = totalPredictions > 0 ? (correctResults / totalPredictions) * 100 : 0
  const pointsPerMatch = totalPredictions > 0 ? totalPoints / totalPredictions : 0

  // Agrupar por time
  const teamStats = new Map<string, { correct: number; total: number }>()

  predictions.forEach((pred) => {
    const match = (pred as { matches?: Match }).matches
    if (!match) return

    const homeTeam = match.home_team
    const awayTeam = match.away_team

    // Home team
    if (!teamStats.has(homeTeam)) teamStats.set(homeTeam, { correct: 0, total: 0 })
    const homeData = teamStats.get(homeTeam)!
    homeData.total++
    if ((pred.points ?? 0) >= 5) homeData.correct++

    // Away team
    if (!teamStats.has(awayTeam)) teamStats.set(awayTeam, { correct: 0, total: 0 })
    const awayData = teamStats.get(awayTeam)!
    awayData.total++
    if ((pred.points ?? 0) >= 5) awayData.correct++
  })

  const favoriteTeams = Array.from(teamStats.entries())
    .map(([team, stats]) => ({
      team,
      accuracy: (stats.correct / stats.total) * 100,
    }))
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 5)

  // Pontos por rodada
  const roundPoints = new Map<string, { name: string; points: number }>()
  predictions.forEach((pred) => {
    const match = (pred as { matches?: Match & { rounds?: { name: string } } }).matches
    if (!match?.rounds) return

    const roundKey = `${match.rounds.name}`
    if (!roundPoints.has(roundKey)) {
      roundPoints.set(roundKey, { name: match.rounds.name, points: 0 })
    }
    const roundData = roundPoints.get(roundKey)!
    roundData.points += pred.points ?? 0
  })

  const pointsByRound = Array.from(roundPoints.values())
    .map((r) => ({ roundId: r.name, roundName: r.name, points: r.points }))

  return {
    totalPredictions,
    totalPoints,
    exactScores,
    correctResults,
    hitRate: Math.round(hitRate * 10) / 10,
    pointsPerMatch: Math.round(pointsPerMatch * 10) / 10,
    favoriteTeams,
    pointsByRound,
  }
}

export function calculatePointsEvolution(
  predictions: Array<Prediction & { matches?: Match & { rounds?: { name: string } } }>
): PointsEvolution[] {
  const roundMap = new Map<string, number>()

  // Ordenar previsões por ordem de rodadas
  const sortedPredictions = [...predictions].sort((a, b) => {
    const roundA = (a as { matches?: Match & { rounds?: { name: string } } }).matches?.rounds?.name ?? ''
    const roundB = (b as { matches?: Match & { rounds?: { name: string } } }).matches?.rounds?.name ?? ''
    return roundA.localeCompare(roundB)
  })

  sortedPredictions.forEach((pred) => {
    const match = (pred as { matches?: Match & { rounds?: { name: string } } }).matches
    if (!match?.rounds) return

    const roundName = match.rounds.name
    const currentPoints = roundMap.get(roundName) ?? 0
    roundMap.set(roundName, currentPoints + (pred.points ?? 0))
  })

  let cumulativePoints = 0
  const evolution: PointsEvolution[] = []

  roundMap.forEach((points, roundName) => {
    cumulativePoints += points
    evolution.push({
      roundName,
      totalPoints: points,
      cumulativePoints,
    })
  })

  return evolution
}
