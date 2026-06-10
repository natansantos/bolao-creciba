'use client'

import type { UserStats } from '@/lib/stats'

interface Props {
  stats: UserStats
}

export default function UserStatistics({ stats }: Props) {
  return (
    <div className="rounded-xl border p-4 lg:p-6 mb-6" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
      <h3 className="font-semibold text-sm lg:text-base mb-4" style={{ color: 'var(--text-primary)' }}>
        📊 Suas Estatísticas
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 mb-4">
        <div
          className="rounded-lg p-3 lg:p-4"
          style={{ backgroundColor: 'var(--bg-base)', borderLeft: '3px solid var(--accent-green)' }}
        >
          <p className="text-xs lg:text-sm" style={{ color: 'var(--text-muted)' }}>Taxa de Acerto</p>
          <p className="font-bebas text-2xl lg:text-3xl" style={{ color: 'var(--accent-green)' }}>
            {stats.hitRate}%
          </p>
        </div>

        <div
          className="rounded-lg p-3 lg:p-4"
          style={{ backgroundColor: 'var(--bg-base)', borderLeft: '3px solid var(--accent-yellow)' }}
        >
          <p className="text-xs lg:text-sm" style={{ color: 'var(--text-muted)' }}>Pontos por Jogo</p>
          <p className="font-bebas text-2xl lg:text-3xl" style={{ color: 'var(--accent-yellow)' }}>
            {stats.pointsPerMatch}
          </p>
        </div>

        <div
          className="rounded-lg p-3 lg:p-4"
          style={{ backgroundColor: 'var(--bg-base)', borderLeft: '3px solid #ff6464' }}
        >
          <p className="text-xs lg:text-sm" style={{ color: 'var(--text-muted)' }}>Placar Exato</p>
          <p className="font-bebas text-2xl lg:text-3xl" style={{ color: '#ff6464' }}>
            {stats.exactScores}
          </p>
        </div>

        <div
          className="rounded-lg p-3 lg:p-4"
          style={{ backgroundColor: 'var(--bg-base)', borderLeft: '3px solid #00d4ff' }}
        >
          <p className="text-xs lg:text-sm" style={{ color: 'var(--text-muted)' }}>Resultado Certo</p>
          <p className="font-bebas text-2xl lg:text-3xl" style={{ color: '#00d4ff' }}>
            {stats.correctResults}
          </p>
        </div>
      </div>

      {stats.favoriteTeams.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
            ⭐ Times Favoritos
          </p>
          <div className="space-y-2.5">
            {stats.favoriteTeams.map((team) => (
              <div key={team.team} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate flex-1" style={{ color: 'var(--text-primary)' }} title={team.team}>
                    {team.team}
                  </span>
                  <span className="text-xs font-semibold ml-2 w-10 text-right" style={{
                    color: team.accuracy > 60 ? 'var(--accent-green)' : team.accuracy > 40 ? 'var(--accent-yellow)' : '#ff6464',
                  }}>
                    {Math.round(team.accuracy)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${team.accuracy}%`,
                      backgroundColor: team.accuracy > 60 ? 'var(--accent-green)' : team.accuracy > 40 ? 'var(--accent-yellow)' : '#ff6464',
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
