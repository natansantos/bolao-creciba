'use client'

interface UserEvolution {
  userId: string
  name: string
  data: Array<{ roundName: string; cumulativePoints: number }>
  isCurrentUser: boolean
}

interface Props {
  users: UserEvolution[]
}

const COLORS = [
  'var(--accent-green)',
  'var(--accent-yellow)',
  '#00d4ff',
  '#ff6464',
  '#a855f7',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
]

export default function AllUsersEvolutionChart({ users }: Props) {
  if (users.length === 0) {
    return null
  }

  const allRounds = Array.from(
    new Set(users.flatMap((u) => u.data.map((d) => d.roundName)))
  ).sort()

  const maxPoints = Math.max(
    ...users.flatMap((u) => u.data.map((d) => d.cumulativePoints)),
    1
  )

  const chartHeight = 300

  return (
    <div className="rounded-xl border p-4 lg:p-6 mb-6" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
      <h3 className="font-semibold text-sm lg:text-base mb-4" style={{ color: 'var(--text-primary)' }}>
        📈 Evolução de Todos os Participantes
      </h3>

      <div className="overflow-x-auto lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0">
        <div style={{ minWidth: '100%', height: `${chartHeight}px` }} className="lg:min-w-full">
          <svg viewBox={`0 0 600 ${chartHeight}`} style={{ width: '100%', height: '100%' }}>
            {/* Grid de fundo */}
            <defs>
              <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 30" fill="none" stroke="var(--bg-border)" strokeWidth="0.5" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="600" height={chartHeight} fill="url(#grid)" />

            {/* Eixo Y - Linhas de referência */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = chartHeight - chartHeight * ratio
              const value = Math.round(maxPoints * ratio)
              return (
                <g key={`y-${ratio}`}>
                  <line x1="50" y1={y} x2="600" y2={y} stroke="var(--bg-border)" strokeWidth="1" opacity="0.3" strokeDasharray="2,2" />
                  <text x="40" y={y + 4} fontSize="10" textAnchor="end" fill="var(--text-muted)">
                    {value}
                  </text>
                </g>
              )
            })}

            {/* Linha do eixo X */}
            <line x1="50" y1={chartHeight - 20} x2="600" y2={chartHeight - 20} stroke="var(--bg-border)" strokeWidth="1" />

            {/* Linhas de cada usuário */}
            {users.map((user, userIdx) => {
              const color = COLORS[userIdx % COLORS.length]
              const points = allRounds.map((round) => {
                const dataPoint = user.data.find((d) => d.roundName === round)
                return dataPoint?.cumulativePoints ?? 0
              })

              const xSpacing = (600 - 50) / (allRounds.length - 1 || 1)

              const pathData = points
                .map((point, idx) => {
                  const x = 50 + idx * xSpacing
                  const y = chartHeight - 20 - (point / maxPoints) * (chartHeight - 40)
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
                })
                .join(' ')

              return (
                <g key={`user-${user.userId}`}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth={user.isCurrentUser ? '3' : '2'}
                    opacity={user.isCurrentUser ? '1' : '0.6'}
                    className="transition-all hover:opacity-100"
                  />

                  {/* Pontos no gráfico */}
                  {points.map((point, idx) => {
                    const x = 50 + idx * xSpacing
                    const y = chartHeight - 20 - (point / maxPoints) * (chartHeight - 40)
                    return (
                      <circle
                        key={`point-${idx}`}
                        cx={x}
                        cy={y}
                        r={user.isCurrentUser ? '4' : '2'}
                        fill={color}
                        opacity={user.isCurrentUser ? '1' : '0.5'}
                        className="hover:r-5 transition-all cursor-pointer"
                      >
                        <title>{`${user.name}: ${point} pts`}</title>
                      </circle>
                    )
                  })}
                </g>
              )
            })}

            {/* Labels do eixo X */}
            {allRounds.map((round, idx) => {
              const xSpacing = (600 - 50) / (allRounds.length - 1 || 1)
              const x = 50 + idx * xSpacing
              return (
                <text
                  key={`x-${round}`}
                  x={x}
                  y={chartHeight - 5}
                  fontSize="10"
                  textAnchor="middle"
                  fill="var(--text-muted)"
                >
                  {round.length > 10 ? `${round.substring(0, 8)}...` : round}
                </text>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        {users.map((user, idx) => {
          const color = COLORS[idx % COLORS.length]
          return (
            <div key={user.userId} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span style={{ color: 'var(--text-primary)' }}>
                {user.name} {user.isCurrentUser && '(você)'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
