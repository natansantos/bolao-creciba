import { Suspense } from 'react'
import Link from 'next/link'
import { ResetPasswordForm } from './form'

export default function ResetPasswordPage() {

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
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Redefinir Senha</h2>
          <Suspense fallback={<div>Carregando...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="text-center text-sm mt-4">
          <Link href="/login" style={{ color: 'var(--accent-green)' }}>Voltar ao login</Link>
        </p>
      </div>
    </div>
  )
}
