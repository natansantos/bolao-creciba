'use client'

import { useActionState } from 'react'
import { resetPasswordAction } from '@/lib/actions/auth'

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPasswordAction, { error: '', success: false })

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
          Nova Senha
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--bg-border)',
            color: 'var(--text-primary)',
          }}
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
          Confirmar Senha
        </label>
        <input
          type="password"
          name="confirmPassword"
          required
          className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--bg-border)',
            color: 'var(--text-primary)',
          }}
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg py-3 font-semibold text-sm transition-opacity disabled:opacity-60"
        style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
      >
        {pending ? 'Atualizando...' : 'Atualizar Senha'}
      </button>
    </form>
  )
}
