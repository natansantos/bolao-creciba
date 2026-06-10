'use client'

import { useState } from 'react'
import { syncAllPendingFromApiAction } from '@/lib/actions/admin'

export default function SyncAllButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  async function handleSync() {
    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const result = await syncAllPendingFromApiAction()

      if (result?.error) {
        setMessageType('error')
        setMessage(result.error)
      } else {
        setMessageType('success')
        setMessage(`${result?.synced ?? 0} resultado(s) sincronizado(s)`)
      }
    } catch (err) {
      setMessageType('error')
      setMessage('Erro ao sincronizar resultados')
    } finally {
      setLoading(false)
      setTimeout(() => {
        setMessage('')
        setMessageType('')
      }, 4000)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="text-sm px-4 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-60"
        style={{
          backgroundColor: 'var(--accent-green)',
          color: '#0D0F0E',
        }}
      >
        {loading ? '🔄 Sincronizando...' : '🔄 Sincronizar Tudo'}
      </button>
      {message && (
        <span
          className="text-sm px-3 py-1 rounded-lg"
          style={{
            backgroundColor: messageType === 'success' ? 'rgba(0,230,118,0.1)' : 'rgba(255,100,100,0.1)',
            color: messageType === 'success' ? 'var(--accent-green)' : '#ff6464',
          }}
        >
          {messageType === 'success' ? '✓' : '✕'} {message}
        </span>
      )}
    </div>
  )
}
