'use client'

import { useState } from 'react'
import { resetPasswordForEmail } from '@/lib/supabase/client-actions'
import Link from 'next/link'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: resetError } = await resetPasswordForEmail(email)

    setLoading(false)

    if (resetError) {
      console.error('Reset password error:', resetError)
      setError('Erro ao enviar email. Tente novamente.')
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <p className="mb-4" style={{ color: 'var(--text-primary)' }}>
          ✓ Email de recuperação enviado com sucesso!
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Verifique sua caixa de entrada e siga as instruções no email para redefinir sua senha.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg py-3 px-6 font-semibold text-sm transition-opacity"
          style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
        >
          Voltar ao Login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 transition-all disabled:opacity-50"
          style={{
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--bg-border)',
            color: 'var(--text-primary)',
          }}
          placeholder="seu@email.com"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg py-3 font-semibold text-sm transition-opacity disabled:opacity-60"
        style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
      >
        {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
      </button>
    </form>
  )
}
