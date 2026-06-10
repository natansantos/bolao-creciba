'use client'

import { useActionState } from 'react'
import { loginAction } from '@/lib/actions/auth'
import Link from 'next/link'

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, { error: '' })

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-bebas text-5xl mb-1" style={{ color: 'var(--accent-green)' }}>
            PALPITEIROS
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Copa do Mundo 2026</p>
        </div>

        <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Entrar</h2>

          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--bg-border)',
                  color: 'var(--text-primary)',
                }}
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
              {pending ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-4">
          Não tem conta? <Link href="/register" style={{ color: 'var(--accent-green)' }}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
