'use client'

import type { PointsEvolution } from '@/lib/stats'

interface Props {
  data: PointsEvolution[]
}

export default function PointsEvolutionChart({ data }: Props) {
  if (data.length === 0) {
    return null
  }

  const maxPoints = Math.max(...data.map((d) => d.cumulativePoints), 1)
  const chartHeight = 200

  return (
    <div className="rounded-xl border p-4 lg:p-6 mb-6" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
      <h3 className="font-semibold text-sm lg:text-base mb-4" style={{ color: 'var(--text-primary)' }}>
        📈 Evolução de Pontos
      </h3>

      <div className="flex items-end justify-between gap-1 lg:gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" style={{ height: `${chartHeight}px` }}>
        {data.map((point, idx) => {
          const heightPercent = (point.cumulativePoints / maxPoints) * 100
          const isLast = idx === data.length - 1

          return (
            <div key={point.roundName} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex justify-center">
                <div
                  className="w-full rounded-t transition-all hover:opacity-80 cursor-pointer group relative"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: isLast ? 'var(--accent-green)' : 'var(--accent-yellow)',
                    minHeight: heightPercent > 0 ? '4px' : '0px',
                  }}
                >
                  <div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundColor: 'var(--bg-base)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--bg-border)',
                    }}
                  >
                    {point.cumulativePoints} pts
                  </div>
                </div>
              </div>
              <span className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                {point.roundName.length > 12 ? `${point.roundName.substring(0, 10)}...` : point.roundName}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
          <span>Rodadas anteriores</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--accent-green)' }}></div>
          <span>Rodada atual</span>
        </div>
      </div>
    </div>
  )
}
