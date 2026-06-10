import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserPointsEvolution } from '@/lib/actions/stats'
import AllUsersEvolutionChart from '@/components/all-users-evolution-chart'
import type { RankingEntry } from '@/lib/types'

export default async function RankingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: ranking } = await supabase.rpc('get_ranking') as { data: RankingEntry[] | null }

  const entries = ranking ?? []
  const myPosition = entries.findIndex((e) => e.id === user.id) + 1

  // Buscar evolução de pontos para cada usuário
  const evolutionPromises = entries.map((entry) =>
    getUserPointsEvolution(entry.id).then((data) => ({ userId: entry.id, name: entry.name, evolution: data }))
  )
  const evolutions = await Promise.all(evolutionPromises)

  // Preparar dados para o gráfico com pontos cumulativos
  const chartData = evolutions.map((e) => {
    let cumulativePoints = 0
    const cumulativeData = e.evolution.map((point) => {
      cumulativePoints += point.points
      return {
        roundName: point.roundName,
        cumulativePoints,
      }
    })

    return {
      userId: e.userId,
      name: e.name,
      data: cumulativeData,
      isCurrentUser: e.userId === user.id,
    }
  })

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-bebas text-4xl lg:text-5xl mb-1" style={{ color: 'var(--text-primary)' }}>Ranking</h1>
        <p className="text-sm lg:text-base" style={{ color: 'var(--text-muted)' }}>
          {myPosition > 0 ? `Você está em ${myPosition}º lugar` : 'Classificação geral'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AllUsersEvolutionChart users={chartData} />

          <h3 className="font-semibold text-sm lg:text-base mb-4" style={{ color: 'var(--text-primary)' }}>
            🏅 Classificação Completa
          </h3>
          <div className="space-y-2">
            {entries.map((entry, idx) => {
          const position = idx + 1
          const isMe = entry.id === user.id

          return (
            <div
              key={entry.id}
              className="flex items-center gap-4 px-4 py-3 rounded-xl border transition-all"
              style={{
                backgroundColor: isMe ? 'rgba(0,230,118,0.08)' : 'var(--bg-surface)',
                borderColor: isMe ? 'var(--accent-green)' : 'var(--bg-border)',
              }}
            >
              <div
                className="font-bebas text-2xl w-8 text-center"
                style={{
                  color: position === 1 ? '#FFD700' : position === 2 ? '#C0C0C0' : position === 3 ? '#CD7F32' : 'var(--text-muted)',
                }}
              >
                {position}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: isMe ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                  {entry.name} {isMe && '(você)'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {entry.exact_scores} placar exato · {entry.correct_results} resultado certo
                </p>
              </div>

              <div className="text-right">
                <p className="font-bebas text-2xl" style={{ color: 'var(--accent-yellow)' }}>
                  {entry.total_points}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>pts</p>
              </div>
            </div>
            )
            })}

            {entries.length === 0 && (
              <div
                className="rounded-2xl p-8 text-center border"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
              >
                <p className="text-4xl mb-3">🏆</p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Ranking vazio</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  Nenhum resultado registrado ainda.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20">
            <div
              className="rounded-xl border p-4 lg:p-6"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
            >
              <h3 className="font-semibold text-sm lg:text-base mb-4" style={{ color: 'var(--text-primary)' }}>
                🏆 Seu Desempenho
              </h3>
              {entries.length > 0 && (
                <div className="space-y-3">
                  {entries.map((entry) => {
                    const isMe = entry.id === user.id
                    if (!isMe) return null

                    return (
                      <div key={entry.id}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bebas text-3xl" style={{ color: '#FFD700' }}>
                            #{myPosition}
                          </span>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--accent-green)' }}>
                              {entry.name}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {entry.exact_scores} placar exato
                            </p>
                          </div>
                        </div>
                        <div className="rounded-lg p-3 lg:p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Total de Pontos</p>
                          <p className="font-bebas text-3xl lg:text-4xl" style={{ color: 'var(--accent-yellow)' }}>
                            {entry.total_points}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
