'use client'

import { useState } from 'react'
import { recalculateAllPointsAction } from '@/lib/actions/admin'

export default function RecalculatePointsButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ error: string | null; matches: number; predictions: number } | null>(null)

  async function handleRecalculate() {
    setLoading(true)
    setResult(null)
    try {
      const r = await recalculateAllPointsAction()
      setResult(r)
    } catch {
      setResult({ error: 'Erro inesperado', matches: 0, predictions: 0 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleRecalculate}
        disabled={loading}
        className="text-sm px-4 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-60"
        style={{ backgroundColor: 'rgba(255,214,0,0.15)', color: 'var(--accent-yellow)', border: '1px solid var(--accent-yellow)' }}
      >
        {loading ? '⏳ Recalculando...' : '🔁 Recalcular pontos'}
      </button>
      {result && (
        <span
          className="text-sm px-3 py-1 rounded-lg"
          style={{
            backgroundColor: result.error ? 'rgba(255,100,100,0.1)' : 'rgba(0,230,118,0.1)',
            color: result.error ? '#ff6464' : 'var(--accent-green)',
          }}
        >
          {result.error
            ? `✕ ${result.error}`
            : `✓ ${result.predictions} palpite(s) recalculado(s) em ${result.matches} jogo(s)`}
        </span>
      )}
    </div>
  )
}
