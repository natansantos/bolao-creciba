'use client'

interface Props {
  data: Array<{ roundName: string; points: number }>
}

export default function MiniEvolutionChart({ data }: Props) {
  if (data.length === 0) {
    return null
  }

  const maxPoints = Math.max(...data.map((d) => d.points), 1)
  const chartHeight = 40

  return (
    <div className="flex items-end justify-between gap-0.5" style={{ height: `${chartHeight}px`, minWidth: '80px' }}>
      {data.map((point) => {
        const heightPercent = (point.points / maxPoints) * 100

        return (
          <div key={point.roundName} className="flex-1 group relative">
            <div
              className="w-full rounded-t transition-all"
              style={{
                height: `${heightPercent}%`,
                backgroundColor: heightPercent > 0 ? 'var(--accent-yellow)' : 'transparent',
                minHeight: heightPercent > 0 ? '2px' : '0px',
              }}
            >
              <div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--bg-border)',
                  fontSize: '10px',
                }}
              >
                {point.points}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
