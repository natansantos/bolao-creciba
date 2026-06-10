import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTeamNamePTBR } from '@/lib/team-names'
import { getFlagUrl } from '@/lib/country-codes'
import { calculateUserStats, calculatePointsEvolution } from '@/lib/stats'
import { calculateUserBadges } from '@/lib/badges'
import { getRoundLeaderboard, getCurrentRound } from '@/lib/actions/stats'
import PointsEvolutionChart from '@/components/points-evolution-chart'
import UserStatistics from '@/components/user-statistics'
import RoundLeaderboard from '@/components/round-leaderboard'
import BadgesDisplay from '@/components/badges-display'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: predictions } = await supabase
    .from('predictions')
    .select(`
      *,
      matches (
        id, home_team, away_team, home_flag, away_flag,
        match_time, home_score, away_score, status,
        went_to_penalties, penalty_winner,
        rounds (name, phase, id)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const items = predictions ?? []
  const totalPoints = items.reduce((sum, p) => sum + (p.points ?? 0), 0)
  const exactScores = items.filter((p) => p.points === 10).length
  const correctResults = items.filter((p) => (p.points ?? 0) >= 5).length

  // Calcular estatísticas
  const stats = await calculateUserStats(items, user.id)
  const pointsEvolution = calculatePointsEvolution(items)
  const badges = calculateUserBadges(items, user.id)

  // Buscar leaderboard da rodada atual
  const currentRound = await getCurrentRound()
  let roundLeaderboard: Awaited<ReturnType<typeof getRoundLeaderboard>> = []
  if (currentRound) {
    roundLeaderboard = await getRoundLeaderboard(currentRound.id)
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <h1 className="font-bebas text-4xl lg:text-5xl mb-1" style={{ color: 'var(--text-primary)' }}>Histórico</h1>
      <p className="text-sm lg:text-base mb-6" style={{ color: 'var(--text-muted)' }}>Todos os seus palpites</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Pontos', value: totalPoints, color: 'var(--accent-yellow)' },
          { label: 'Placar exato', value: exactScores, color: 'var(--accent-green)' },
          { label: 'Resultado certo', value: correctResults, color: 'var(--text-primary)' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center border"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
          >
            <p className="font-bebas text-2xl lg:text-3xl" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs lg:text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PointsEvolutionChart data={pointsEvolution} />

          <div className="space-y-3">
            {items.map((pred) => {
          const match = (pred as { matches?: { home_team: string; away_team: string; home_flag?: string; away_flag?: string; match_time: string; home_score: number | null; away_score: number | null; status: string; rounds?: { name: string } } }).matches
          if (!match) return null

          const matchDate = new Date(match.match_time)
          const hasResult = match.status === 'finished' && match.home_score !== null
          const homeName = getTeamNamePTBR(match.home_team)
          const awayName = getTeamNamePTBR(match.away_team)
          const homeFlagUrl = getFlagUrl(match.home_team)
          const awayFlagUrl = getFlagUrl(match.away_team)

          return (
            <div
              key={pred.id}
              className="rounded-xl border p-4"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {(match.rounds as { name: string } | undefined)?.name ?? ''} · {matchDate.toLocaleDateString('pt-BR')}
                </span>
                {pred.points !== null && (
                  <span
                    className="font-bebas text-lg px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: pred.points >= 10 ? 'rgba(0,230,118,0.15)' : pred.points >= 5 ? 'rgba(255,214,0,0.1)' : 'rgba(255,255,255,0.05)',
                      color: pred.points >= 10 ? 'var(--accent-green)' : pred.points >= 5 ? 'var(--accent-yellow)' : 'var(--text-muted)',
                    }}
                  >
                    {pred.points} pts
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {homeName}
                    </span>
                    {homeFlagUrl && (
                      <div className="w-6 h-4 rounded overflow-hidden shrink-0 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={homeFlagUrl} alt={homeName} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center shrink-0">
                  <div className="font-bebas text-xl" style={{ color: 'var(--accent-yellow)' }}>
                    {pred.home_score_pred} × {pred.away_score_pred}
                  </div>
                  {hasResult && (
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      real: {match.home_score} × {match.away_score}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {awayFlagUrl && (
                      <div className="w-6 h-4 rounded overflow-hidden shrink-0 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={awayFlagUrl} alt={awayName} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {awayName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            )
            })}

            {items.length === 0 && (
              <div
                className="rounded-2xl p-8 text-center border"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
              >
                <p className="text-4xl mb-3">📋</p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Nenhum palpite ainda</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  Acesse o Dashboard para fazer seus palpites.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20 space-y-6">
            <BadgesDisplay badges={badges} />
            <UserStatistics stats={stats} />
            {currentRound && <RoundLeaderboard data={roundLeaderboard} currentUserId={user.id} roundName={currentRound.name} />}
          </div>
        </div>
      </div>
    </div>
  )
}
