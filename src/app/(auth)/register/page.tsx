import { Suspense } from 'react'
import RegisterForm from './register-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-bebas text-5xl mb-1" style={{ color: 'var(--accent-green)' }}>
            PALPITEIROS
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Copa do Mundo 2026</p>
        </div>

        <Suspense fallback={<div className="text-center" style={{ color: 'var(--text-muted)' }}>Carregando...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  )
}
