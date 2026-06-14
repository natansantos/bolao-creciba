import { requireAdmin } from '@/lib/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { createMatchAction, updateMatchTimeAction } from '@/lib/actions/admin'
import { getTeamNamePTBR } from '@/lib/team-names'
import { getFlagUrl } from '@/lib/country-codes'
import ResyncTimesButton from '@/components/resync-times-button'
import type { Round, Match } from '@/lib/types'

function toBrasiliaDatetimeLocal(utcString: string): string {
  const d = new Date(utcString)
  // UTC-3 (Brasília, sem DST desde 2019)
  const local = new Date(d.getTime() - 3 * 60 * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

export default async function MatchesPage() {
  await requireAdmin()

  const admin = createAdminClient()
  const { data: rounds } = await admin.from('rounds').select('*').order('created_at')
  const { data: matches } = await admin
    .from('matches')
    .select('*, rounds(name)')
    .order('match_time', { ascending: true })

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="font-bebas text-4xl mb-1" style={{ color: 'var(--text-primary)' }}>Jogos</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Adicione os jogos de cada rodada</p>

      <ResyncTimesButton />

      <form action={createMatchAction} className="rounded-xl border p-4 mb-6 space-y-3" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Novo Jogo</p>

        <select
          name="round_id"
          required
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
        >
          <option value="">Selecione a rodada</option>
          {(rounds ?? []).map((r: Round) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Time Casa</label>
            <input
              type="text"
              name="home_team"
              required
              placeholder="Brasil"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Time Visitante</label>
            <input
              type="text"
              name="away_team"
              required
              placeholder="Argentina"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Bandeira Casa (emoji)</label>
            <input
              type="text"
              name="home_flag"
              placeholder="🇧🇷"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Bandeira Visitante (emoji)</label>
            <input
              type="text"
              name="away_flag"
              placeholder="🇦🇷"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Data e hora (Brasília)</label>
            <input
              type="datetime-local"
              name="match_time"
              required
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>ID API-Football (opcional)</label>
            <input
              type="number"
              name="api_fixture_id"
              placeholder="123456"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_knockout" value="true" className="rounded" />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Jogo eliminatório (pode ir para pênaltis)</span>
        </label>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
        >
          Adicionar jogo
        </button>
      </form>

      <div className="space-y-2">
        {(matches ?? []).map((match: Match & { rounds?: { name: string } }) => {
          const homeName = getTeamNamePTBR(match.home_team)
          const awayName = getTeamNamePTBR(match.away_team)
          const homeFlagUrl = getFlagUrl(match.home_team)
          const awayFlagUrl = getFlagUrl(match.away_team)

          return (
          <div
            key={match.id}
            className="rounded-xl border p-3 space-y-2"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1">
                    {homeFlagUrl && (
                      <div className="w-5 h-3.5 rounded overflow-hidden shrink-0 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={homeFlagUrl} alt={homeName} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {homeName}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>×</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {awayName}
                    </span>
                    {awayFlagUrl && (
                      <div className="w-5 h-3.5 rounded overflow-hidden shrink-0 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={awayFlagUrl} alt={awayName} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {(match.rounds as { name: string } | undefined)?.name} · {new Date(match.match_time).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })} (Brasília)
                  {match.is_knockout && ' · Eliminatório'}
                </p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full shrink-0"
                style={{
                  backgroundColor: match.status === 'finished' ? 'rgba(255,214,0,0.1)' : match.status === 'live' ? 'rgba(255,100,100,0.1)' : 'rgba(255,255,255,0.05)',
                  color: match.status === 'finished' ? 'var(--accent-yellow)' : match.status === 'live' ? '#ff6464' : 'var(--text-muted)',
                }}
              >
                {match.status}
              </span>
            </div>
            <form action={updateMatchTimeAction} className="flex items-center gap-2">
              <input type="hidden" name="match_id" value={match.id} />
              <input
                type="datetime-local"
                name="match_time"
                defaultValue={toBrasiliaDatetimeLocal(match.match_time)}
                className="flex-1 rounded-lg px-2 py-1 text-xs outline-none"
                style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--bg-border)', color: 'var(--text-primary)' }}
              />
              <button
                type="submit"
                className="text-xs px-3 py-1 rounded-lg font-medium shrink-0"
                style={{ backgroundColor: 'rgba(0,230,118,0.15)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)' }}
              >
                Corrigir horário
              </button>
            </form>
          </div>
          )
        })}

        {(!matches || matches.length === 0) && (
          <p className="text-center text-sm py-8" style={{ color: 'var(--text-muted)' }}>Nenhum jogo cadastrado.</p>
        )}
      </div>
    </div>
  )
}
