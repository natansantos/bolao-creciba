'use client'

import { useState } from 'react'
import { seedWorldCupAction } from '@/lib/actions/admin'

export default function SeedButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSeed() {
    setStatus('loading')
    setMessage('')

    try {
      const result = await seedWorldCupAction()
      if (result?.error) {
        setStatus('error')
        setMessage(result.error)
      } else {
        setStatus('done')
        setMessage(`${result?.inserted ?? 0} jogo(s) importado(s) com sucesso!`)
      }
    } catch (e) {
      setStatus('error')
      setMessage(e instanceof Error ? e.message : 'Erro inesperado.')
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleSeed}
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
        style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
      >
        {status === 'loading' ? '⏳ Importando jogos...' : '🌍 Importar Copa 2026'}
      </button>

      {status === 'done' && (
        <div
          className="rounded-lg p-3 text-sm"
          style={{ backgroundColor: 'rgba(0,230,118,0.1)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)' }}
        >
          ✓ {message}
        </div>
      )}

      {status === 'error' && (
        <div
          className="rounded-lg p-3 text-sm"
          style={{ backgroundColor: 'rgba(255,100,100,0.1)', color: '#ff6464', border: '1px solid rgba(255,100,100,0.3)' }}
        >
          ✕ {message}
        </div>
      )}
    </div>
  )
}
