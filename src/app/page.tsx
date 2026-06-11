import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/how-it-works')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--bg-border)' }}>
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 flex items-center justify-between">
          <h1 className="font-bebas text-3xl lg:text-4xl" style={{ color: 'var(--accent-green)' }}>
            PALPITEIROS
          </h1>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="text-sm px-4 py-2 rounded-lg font-semibold"
              style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
            >
              Cadastro
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full py-20 text-center">
          <h2 className="font-bebas text-5xl lg:text-6xl mb-6" style={{ color: 'var(--text-primary)' }}>
            Copa do Mundo 2026
          </h2>
          <p className="text-lg lg:text-xl mb-8" style={{ color: 'var(--text-muted)' }}>
            Faça seus palpites, compete com amigos e desbloqueie badges especiais
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
              <div className="text-3xl mb-2">🎯</div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Palpites em Tempo Real</p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Faça seus palpites de placar antes de cada jogo</p>
            </div>
            <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
              <div className="text-3xl mb-2">🏆</div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Ranking Global</p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Compete e veja sua posição no ranking</p>
            </div>
            <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
              <div className="text-3xl mb-2">🏅</div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Badges e Conquistas</p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Desbloqueie badges ao atingir objetivos</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/how-it-works"
              className="px-8 py-3 rounded-lg font-semibold"
              style={{ backgroundColor: 'var(--accent-yellow)', color: '#0D0F0E' }}
            >
              Como Funciona
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 rounded-lg font-semibold"
              style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm" style={{ borderColor: 'var(--bg-border)', color: 'var(--text-muted)' }}>
        <p>© 2026 Palpiteiros. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
