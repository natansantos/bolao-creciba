import { requireAdmin } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { createRoundAction, updateRoundStatusAction, unlockAllGroupsAction } from '@/lib/actions/admin'
import type { Round } from '@/lib/types'

const phaseLabels: Record<string, string> = {
  group: 'Fase de Grupos',
  round_of_32: 'Rodada de 32',
  round_of_16: 'Oitavas de Final',
  quarterfinal: 'Quartas de Final',
  semifinal: 'Semifinal',
  third_place: 'Terceiro Lugar',
  final: 'Final',
}

const statusLabels: Record<string, string> = {
  locked: 'Bloqueada',
  open: 'Aberta',
  finished: 'Finalizada',
}

const statusColors: Record<string, string> = {
  locked: 'var(--text-muted)',
  open: 'var(--accent-green)',
  finished: 'var(--accent-yellow)',
}

export default async function RoundsPage() {
  await requireAdmin()

  const admin = createAdminClient()
  const { data: rounds } = await admin
    .from('rounds')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-bebas text-4xl mb-1" style={{ color: 'var(--text-primary)' }}>Rodadas</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Gerencie as rodadas do bolão</p>

      {(rounds ?? []).some((r: Round) => r.phase === 'group' && r.status === 'locked') && (
        <form action={unlockAllGroupsAction} className="mb-4">
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
          >
            Desbloquear todos os grupos de uma vez
          </button>
        </form>
      )}

      <form action={createRoundAction} className="rounded-xl border p-4 mb-6 space-y-3" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Nova Rodada</p>
        <div className="flex gap-3">
          <input
            type="text"
            name="name"
            required
            placeholder="Ex: Rodada 1 — Grupo A"
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
          />
          <select
            name="phase"
            required
            className="rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
          >
            {Object.entries(phaseLabels).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
        >
          Criar rodada
        </button>
      </form>

      <div className="space-y-2">
        {(rounds ?? []).map((round: Round) => (
          <div
            key={round.id}
            className="rounded-xl border p-4 flex items-center justify-between gap-3"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
          >
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{round.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{phaseLabels[round.phase]}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium" style={{ color: statusColors[round.status] }}>
                {statusLabels[round.status]}
              </span>
              <form action={updateRoundStatusAction} className="flex gap-1">
                <input type="hidden" name="round_id" value={round.id} />
                {(['locked', 'open', 'finished'] as const).filter((s) => s !== round.status).map((s) => (
                  <button
                    key={s}
                    type="submit"
                    name="status"
                    value={s}
                    className="text-xs px-2 py-1 rounded-lg transition-colors"
                    style={{ border: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}
                  >
                    → {statusLabels[s]}
                  </button>
                ))}
              </form>
            </div>
          </div>
        ))}

        {(!rounds || rounds.length === 0) && (
          <p className="text-center text-sm py-8" style={{ color: 'var(--text-muted)' }}>Nenhuma rodada criada.</p>
        )}
      </div>
    </div>
  )
}
