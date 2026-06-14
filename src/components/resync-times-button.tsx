'use client'

import { useState } from 'react'
import { resyncMatchTimesAction } from '@/lib/actions/admin'

export default function ResyncTimesButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    error: string | null
    updated: number
    skipped: string[]
    report: string[]
  } | null>(null)

  async function handleResync() {
    setLoading(true)
    setResult(null)
    try {
      const r = await resyncMatchTimesAction()
      setResult(r)
    } catch {
      setResult({ error: 'Erro inesperado', updated: 0, skipped: [], report: [] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6 rounded-xl border p-4 space-y-3" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Corrigir horários via API</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Rebusca todos os horários na Zafronix e corrige automaticamente os que estiverem errados
          </p>
        </div>
        <button
          onClick={handleResync}
          disabled={loading}
          className="text-sm px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-60 shrink-0 ml-4"
          style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
        >
          {loading ? '🔄 Verificando...' : '🔄 Corrigir horários'}
        </button>
      </div>

      {result && (
        <div
          className="rounded-lg p-3 text-xs space-y-1"
          style={{
            backgroundColor: result.error ? 'rgba(255,100,100,0.08)' : 'rgba(0,230,118,0.08)',
            border: `1px solid ${result.error ? 'rgba(255,100,100,0.3)' : 'rgba(0,230,118,0.3)'}`,
          }}
        >
          {result.error ? (
            <p style={{ color: '#ff6464' }}>✕ {result.error}</p>
          ) : (
            <>
              <p style={{ color: 'var(--accent-green)' }}>
                ✓ {result.updated === 0 ? 'Todos os horários já estavam corretos.' : `${result.updated} jogo(s) corrigido(s).`}
              </p>
              {result.report.map((line, i) => (
                <p key={i} style={{ color: 'var(--text-primary)' }}>• {line}</p>
              ))}
              {result.skipped.length > 0 && (
                <details className="mt-1">
                  <summary className="cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                    {result.skipped.length} ignorado(s)
                  </summary>
                  {result.skipped.map((line, i) => (
                    <p key={i} style={{ color: 'var(--text-muted)' }}>• {line}</p>
                  ))}
                </details>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
