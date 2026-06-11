'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { calculatePoints } from '@/lib/scoring'
import { getFlag } from '@/lib/flags'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) throw new Error('Unauthorized')

  return user
}

export async function createRoundAction(formData: FormData) {
  await assertAdmin()
  const admin = createAdminClient()

  const name = formData.get('name') as string
  const phase = formData.get('phase') as string

  await admin.from('rounds').insert({ name, phase, status: 'locked' })
  revalidatePath('/admin/rounds')
}

export async function updateRoundStatusAction(formData: FormData) {
  await assertAdmin()
  const admin = createAdminClient()

  const roundId = formData.get('round_id') as string
  const status = formData.get('status') as string

  await admin.from('rounds').update({ status }).eq('id', roundId)
  revalidatePath('/admin/rounds')
}

export async function unlockAllGroupsAction() {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.from('rounds').update({ status: 'open' }).eq('phase', 'group').eq('status', 'locked')
  revalidatePath('/admin/rounds')
}

export async function createMatchAction(formData: FormData) {
  await assertAdmin()
  const admin = createAdminClient()

  const roundId = formData.get('round_id') as string
  const homeTeam = formData.get('home_team') as string
  const awayTeam = formData.get('away_team') as string
  const homeFlag = (formData.get('home_flag') as string) || null
  const awayFlag = (formData.get('away_flag') as string) || null
  const matchTime = formData.get('match_time') as string
  const apiFixtureId = formData.get('api_fixture_id')
  const isKnockout = formData.get('is_knockout') === 'true'

  await admin.from('matches').insert({
    round_id: roundId,
    home_team: homeTeam,
    away_team: awayTeam,
    home_flag: homeFlag,
    away_flag: awayFlag,
    match_time: new Date(matchTime).toISOString(),
    is_knockout: isKnockout,
    api_fixture_id: apiFixtureId ? parseInt(apiFixtureId as string) : null,
    status: 'upcoming',
  })

  revalidatePath('/admin/matches')
}

export async function saveResultAction(formData: FormData) {
  await assertAdmin()
  const admin = createAdminClient()

  const matchId = formData.get('match_id') as string
  const homeScore = parseInt(formData.get('home_score') as string)
  const awayScore = parseInt(formData.get('away_score') as string)
  const wentToPenalties = formData.get('went_to_penalties') === 'true'
  const penaltyWinner = (formData.get('penalty_winner') as 'home' | 'away') || null

  await admin.from('matches').update({
    home_score: homeScore,
    away_score: awayScore,
    went_to_penalties: wentToPenalties,
    penalty_winner: penaltyWinner,
    status: 'finished',
  }).eq('id', matchId)

  await computePoints(matchId, homeScore, awayScore, wentToPenalties, penaltyWinner)

  revalidatePath('/admin/results')
  revalidatePath('/predictions')
  revalidatePath('/ranking')
  revalidatePath('/history')
}

async function computePoints(
  matchId: string,
  homeScore: number,
  awayScore: number,
  wentToPenalties: boolean,
  penaltyWinner: 'home' | 'away' | null
) {
  const admin = createAdminClient()

  const { data: predictions } = await admin
    .from('predictions')
    .select('id, home_score_pred, away_score_pred, penalty_winner_pred')
    .eq('match_id', matchId)

  if (!predictions || predictions.length === 0) return

  for (const pred of predictions) {
    const points = calculatePoints(
      { home_score: homeScore, away_score: awayScore, went_to_penalties: wentToPenalties, penalty_winner: penaltyWinner },
      { home_score_pred: pred.home_score_pred, away_score_pred: pred.away_score_pred, penalty_winner_pred: pred.penalty_winner_pred }
    )

    await admin.from('predictions').update({ points }).eq('id', pred.id)
  }
}

export async function syncFromApiAction(formData: FormData) {
  await assertAdmin()
  const admin = createAdminClient()

  const matchId = formData.get('match_id') as string

  const { data: match } = await admin
    .from('matches')
    .select('api_fixture_id')
    .eq('id', matchId)
    .single()

  if (!match?.api_fixture_id) return

  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) return

  const res = await fetch(`https://v3.football.api-sports.io/fixtures?id=${match.api_fixture_id}`, {
    headers: { 'x-apisports-key': apiKey },
    cache: 'no-store',
  })

  if (!res.ok) return

  const json = await res.json()
  const fixture = json?.response?.[0]

  if (!fixture) return

  const status = fixture.fixture?.status?.short
  if (status !== 'FT') return

  const homeScore = fixture.goals?.home ?? 0
  const awayScore = fixture.goals?.away ?? 0
  const penHome = fixture.score?.penalty?.home
  const penAway = fixture.score?.penalty?.away
  const wentToPenalties = penHome !== null && penAway !== null
  const penaltyWinner = wentToPenalties
    ? penHome > penAway ? 'home' : 'away'
    : null

  await admin.from('matches').update({
    home_score: homeScore,
    away_score: awayScore,
    went_to_penalties: wentToPenalties,
    penalty_winner: penaltyWinner,
    status: 'finished',
  }).eq('id', matchId)

  await computePoints(matchId, homeScore, awayScore, wentToPenalties, penaltyWinner as 'home' | 'away' | null)

  revalidatePath('/admin/results')
  revalidatePath('/predictions')
  revalidatePath('/ranking')
  revalidatePath('/history')
}

export async function syncAllPendingFromApiAction() {
  await assertAdmin()
  const admin = createAdminClient()

  const apiKey = process.env.ZAFRONIX_API_KEY
  if (!apiKey) return { error: 'ZAFRONIX_API_KEY não configurada', synced: 0 }

  try {
    const res = await fetch('https://api.zafronix.com/fifa/worldcup/v1/matches?year=2026', {
      headers: { 'X-API-Key': apiKey },
      cache: 'no-store',
    })

    if (!res.ok) return { error: `Erro na API Zafronix: HTTP ${res.status}`, synced: 0 }

    const json = await res.json()
    const allMatches: ZafronixMatch[] = json?.data ?? []

    if (allMatches.length === 0) {
      return { error: 'Nenhum jogo retornado pela API', synced: 0 }
    }

    const { data: pendingMatches } = await admin
      .from('matches')
      .select('id, home_team, away_team')
      .neq('status', 'finished')

    if (!pendingMatches || pendingMatches.length === 0) {
      return { error: null, synced: 0 }
    }

    let synced = 0

    for (const pending of pendingMatches) {
      const apiMatch = allMatches.find(
        (m) => m.homeTeam === pending.home_team && m.awayTeam === pending.away_team
      )

      if (!apiMatch || apiMatch.homeScore === null || apiMatch.awayScore === null) {
        continue
      }

      const homeScore = apiMatch.homeScore
      const awayScore = apiMatch.awayScore
      const wentToPenalties = false
      const penaltyWinner = null

      await admin.from('matches').update({
        home_score: homeScore,
        away_score: awayScore,
        went_to_penalties: wentToPenalties,
        penalty_winner: penaltyWinner,
        status: 'finished',
      }).eq('id', pending.id)

      await computePoints(pending.id, homeScore, awayScore, wentToPenalties, penaltyWinner)
      synced++
    }

    revalidatePath('/admin/results')
    revalidatePath('/predictions')
    revalidatePath('/ranking')
    revalidatePath('/history')

    return { error: null, synced }
  } catch (err) {
    return { error: 'Erro ao sincronizar da API', synced: 0 }
  }
}

type ZafronixMatch = {
  id: string
  date: string
  kickoff: string
  kickoffUtc: string | null
  stage: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
}

function zafronixStageToRoundName(stage: string): string {
  if (stage.startsWith('group_')) {
    const letter = stage.replace('group_', '').toUpperCase()
    return `Grupo ${letter}`
  }
  const map: Record<string, string> = {
    round_of_32: 'Rodada de 32',
    round_of_16: 'Oitavas de Final',
    quarter_final: 'Quartas de Final',
    semi_final: 'Semifinal',
    third_place: 'Terceiro Lugar',
    final: 'Final',
  }
  return map[stage] ?? stage
}

function zafronixStageToPhase(stage: string): string {
  if (stage.startsWith('group_')) return 'group'
  const map: Record<string, string> = {
    round_of_32: 'round_of_32',
    round_of_16: 'round_of_16',
    quarter_final: 'quarterfinal',
    semi_final: 'semifinal',
    third_place: 'third_place',
    final: 'final',
  }
  return map[stage] ?? 'final'
}

const STAGE_ORDER = [
  'group_a','group_b','group_c','group_d','group_e','group_f',
  'group_g','group_h','group_i','group_j','group_k','group_l',
  'round_of_32','round_of_16','quarter_final','semi_final','third_place','final',
]

export async function seedWorldCupAction(): Promise<{ error: string | null; inserted: number }> {
  try {
    await assertAdmin()
  } catch (e) {
    return { error: `Sem permissão: ${e instanceof Error ? e.message : String(e)}`, inserted: 0 }
  }

  const apiKey = process.env.ZAFRONIX_API_KEY
  if (!apiKey) return { error: 'ZAFRONIX_API_KEY não configurada no .env.local', inserted: 0 }

  const admin = createAdminClient()

  try {
    // Busca todos os jogos da Copa 2026 via Zafronix API
    const res = await fetch('https://api.zafronix.com/fifa/worldcup/v1/matches?year=2026', {
      headers: { 'X-API-Key': apiKey },
      cache: 'no-store',
    })

    if (!res.ok) return { error: `Erro na API Zafronix: HTTP ${res.status}`, inserted: 0 }

    const json = await res.json()
    const matches: ZafronixMatch[] = json?.data ?? []

    if (matches.length === 0) {
      return { error: 'Nenhum jogo retornado pela API. Verifique a chave ZAFRONIX_API_KEY.', inserted: 0 }
    }

    // Agrupa por stage, ordena conforme a ordem do torneio
    const stageMap = new Map<string, ZafronixMatch[]>()
    for (const m of matches) {
      if (!stageMap.has(m.stage)) stageMap.set(m.stage, [])
      stageMap.get(m.stage)!.push(m)
    }

    const sortedStages = Array.from(stageMap.keys()).sort((a, b) => {
      const ai = STAGE_ORDER.indexOf(a)
      const bi = STAGE_ORDER.indexOf(b)
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })

    let inserted = 0

    for (const stage of sortedStages) {
      const stageMatches = stageMap.get(stage)!
      const roundName = zafronixStageToRoundName(stage)
      const phase = zafronixStageToPhase(stage)
      const isKnockout = phase !== 'group'

      const { data: existing } = await admin.from('rounds').select('id').eq('name', roundName).maybeSingle()
      let roundId: string

      if (existing?.id) {
        roundId = existing.id
      } else {
        const { data: newRound } = await admin
          .from('rounds')
          .insert({ name: roundName, phase, status: 'locked' })
          .select('id')
          .single()
        if (!newRound?.id) continue
        roundId = newRound.id
      }

      // Ordena os jogos do stage por data/horário
      stageMatches.sort((a, b) => {
        const da = a.kickoffUtc ?? `${a.date}T${a.kickoff}`
        const db = b.kickoffUtc ?? `${b.date}T${b.kickoff}`
        return da.localeCompare(db)
      })

      for (const m of stageMatches) {
        const homeTeam = m.homeTeam ?? ''
        const awayTeam = m.awayTeam ?? ''

        // Usa kickoffUtc (UTC real) — kickoff é horário local do estádio
        const matchTime = m.kickoffUtc ?? `${m.date}T${m.kickoff}:00Z`
        const { data: dup } = await admin
          .from('matches')
          .select('id')
          .eq('home_team', homeTeam)
          .eq('away_team', awayTeam)
          .eq('round_id', roundId)
          .maybeSingle()
        if (dup?.id) continue

        await admin.from('matches').insert({
          round_id: roundId,
          home_team: homeTeam,
          away_team: awayTeam,
          home_flag: getFlag(homeTeam),
          away_flag: getFlag(awayTeam),
          match_time: matchTime,
          is_knockout: isKnockout,
          status: 'upcoming',
        })
        inserted++
      }
    }

    revalidatePath('/admin/rounds')
    revalidatePath('/admin/matches')
    return { error: null, inserted }

  } catch (e) {
    return { error: `Exceção: ${e instanceof Error ? e.message : String(e)}`, inserted: 0 }
  }
}

export async function createInviteAction() {
  const user = await assertAdmin()
  const admin = createAdminClient()

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)

  await admin.from('invite_links').insert({
    created_by: user.id,
    expires_at: expiresAt.toISOString(),
    used: false,
  })

  revalidatePath('/admin/invites')
}
