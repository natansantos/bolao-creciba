import { requireAdmin } from '@/lib/require-admin'
import SeedButton from './seed-button'

export default async function SeedPage() {
  await requireAdmin()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-bebas text-4xl mb-1" style={{ color: 'var(--text-primary)' }}>
        Popular Copa 2026
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Importa automaticamente todas as rodadas e jogos da Copa do Mundo 2026 via API-Football
      </p>

      <div
        className="rounded-2xl border p-6 space-y-4"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
      >
        <div className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <p>✓ Cria rodadas organizadas por fase (Grupos A–L, Oitavas, etc.)</p>
          <p>✓ Cadastra todos os 104 jogos com horários e times</p>
          <p>✓ Associa bandeiras automaticamente</p>
          <p>✓ Ignora jogos já cadastrados (seguro rodar mais de uma vez)</p>
          <p>✓ Dados via <strong>Zafronix World Cup API</strong> (requer <code>ZAFRONIX_API_KEY</code> no .env.local)</p>
        </div>

        <SeedButton />
      </div>
    </div>
  )
}
