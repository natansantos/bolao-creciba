'use client'

import { useActionState } from 'react'
import { registerAction } from '@/lib/actions/auth'
import Link from 'next/link'

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, { error: '' })

  return (
    <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
      <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Criar conta</h2>

      <form action={action} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Nome
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
            style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
            style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Senha
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
            style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
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
          {pending ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        <Link href="/login" style={{ color: 'var(--text-muted)' }}>
          Já tem conta? Entrar
        </Link>
      </p>
    </div>
  )
}
