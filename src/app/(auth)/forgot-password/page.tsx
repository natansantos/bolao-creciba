'use client'

import { useActionState } from 'react'
import { forgotPasswordAction } from '@/lib/actions/auth'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPasswordAction, { error: '', success: false })

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
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Recuperar Senha</h2>

          {state?.success ? (
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
          ) : (
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

              {state?.error && (
                <p className="text-sm text-red-400">{state.error}</p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg py-3 font-semibold text-sm transition-opacity disabled:opacity-60"
                style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
              >
                {pending ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm mt-4">
          Lembrou a senha? <Link href="/login" style={{ color: 'var(--accent-green)' }}>Volte ao login</Link>
        </p>
      </div>
    </div>
  )
}
