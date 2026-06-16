import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { calculatePoints } from '@/lib/scoring'

// Vercel sends Authorization: Bearer $CRON_SECRET automatically for cron-triggered requests.
// External cron services (cron-job.org etc.) must include the same header manually.
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const apiKey = process.env.ZAFRONIX_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ZAFRONIX_API_KEY não configurada' }, { status: 500 })
  }

  const admin = createAdminClient()

  // Only matches that should have ended: match_time + 100 min < now (90 min game + 10 min buffer)
  const cutoff = new Date(Date.now() - 100 * 60 * 1000).toISOString()

  const { data: pendingMatches } = await admin
    .from('matches')
    .select('id, home_team, away_team, match_time')
    .neq('status', 'finished')
    .lt('match_time', cutoff)

  if (!pendingMatches || pendingMatches.length === 0) {
    return NextResponse.json({ synced: 0, checked: 0, message: 'Nenhum jogo aguardando resultado' })
  }

  const res = await fetch('https://api.zafronix.com/fifa/worldcup/v1/matches?year=2026', {
    headers: { 'X-API-Key': apiKey },
    cache: 'no-store',
  })

  if (!res.ok) {
    return NextResponse.json({ error: `Zafronix API error: HTTP ${res.status}` }, { status: 502 })
  }

  const json = await res.json()
  const apiMatches: Array<{
    homeTeam: string
    awayTeam: string
    homeScore: number | null
    awayScore: number | null
  }> = json?.data ?? []

  let synced = 0
  const log: string[] = []

  for (const match of pendingMatches) {
    const apiMatch = apiMatches.find(
      (m) => m.homeTeam === match.home_team && m.awayTeam === match.away_team
    )

    if (!apiMatch || apiMatch.homeScore === null || apiMatch.awayScore === null) {
      log.push(`pending: ${match.home_team} × ${match.away_team}`)
      continue
    }

    const homeScore = apiMatch.homeScore
    const awayScore = apiMatch.awayScore

    await admin.from('matches').update({
      home_score: homeScore,
      away_score: awayScore,
      went_to_penalties: false,
      penalty_winner: null,
      status: 'finished',
    }).eq('id', match.id)

    const { data: predictions } = await admin
      .from('predictions')
      .select('id, home_score_pred, away_score_pred, penalty_winner_pred')
      .eq('match_id', match.id)

    for (const pred of predictions ?? []) {
      const points = calculatePoints(
        { home_score: homeScore, away_score: awayScore, went_to_penalties: false, penalty_winner: null },
        { home_score_pred: pred.home_score_pred, away_score_pred: pred.away_score_pred, penalty_winner_pred: pred.penalty_winner_pred ?? null }
      )
      await admin.from('predictions').update({ points }).eq('id', pred.id)
    }

    log.push(`synced: ${match.home_team} × ${match.away_team} ${homeScore}-${awayScore}`)
    synced++
  }

  return NextResponse.json({ synced, checked: pendingMatches.length, log })
}
