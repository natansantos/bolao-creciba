'use client'

import { useState } from 'react'
import type { RoundLeaderboard } from '@/lib/stats'

interface Props {
  data: RoundLeaderboard[]
  currentUserId: string
  roundName: string
}

export default function RoundLeaderboard({ data, currentUserId, roundName }: Props) {
  const topFive = data.slice(0, 5)

  if (topFive.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl border p-4 lg:p-6 mb-6" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
      <h3 className="font-semibold text-sm lg:text-base mb-4" style={{ color: 'var(--text-primary)' }}>
        👥 Top 5 - {roundName}
      </h3>

      <div className="space-y-2">
        {topFive.map((entry, idx) => {
          const position = idx + 1
          const isMe = entry.userId === currentUserId
          const medalEmoji = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '  '

          return (
            <div
              key={entry.userId}
              className="flex items-center gap-3 px-3 py-2 rounded-lg border transition-all"
              style={{
                backgroundColor: isMe ? 'rgba(0,230,118,0.08)' : 'var(--bg-base)',
                borderColor: isMe ? 'var(--accent-green)' : 'transparent',
              }}
            >
              <span className="w-6 text-center font-bebas text-lg">{medalEmoji}</span>

              <div className="flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: isMe ? 'var(--accent-green)' : 'var(--text-primary)',
                  }}
                >
                  {entry.name} {isMe && '(você)'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {entry.exactScores} placar exato · {entry.correctResults} resultado certo
                </p>
              </div>

              <div className="text-right">
                <p className="font-bebas text-xl" style={{ color: 'var(--accent-yellow)' }}>
                  {entry.roundPoints}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>pts</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
