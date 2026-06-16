'use client'

import { useState, useEffect } from 'react'
import { isPredictionAllowed, getDeadline } from '@/lib/deadline'
import { savePredictionAction } from '@/lib/actions/predictions'
import { getFlagUrl } from '@/lib/country-codes'
import { getTeamNamePTBR } from '@/lib/team-names'
import type { Match, Prediction, Round } from '@/lib/types'

interface Props {
  match: Match
  prediction: Prediction | null
  round?: Round
}

function CountdownTimer({ matchTime }: { matchTime: string }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [allowed, setAllowed] = useState(true)

  useEffect(() => {
    function update() {
      const deadline = getDeadline(matchTime)
      const now = new Date()
      const diff = deadline.getTime() - now.getTime()

      if (diff <= 0) {
        setAllowed(false)
        setTimeLeft('Encerrado')
        return
      }

      setAllowed(true)
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      if (h > 0) {
        setTimeLeft(`${h}h ${m}m`)
      } else if (m > 0) {
        setTimeLeft(`${m}m ${s}s`)
      } else {
        setTimeLeft(`${s}s`)
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [matchTime])

  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: allowed ? 'rgba(0,230,118,0.1)' : 'rgba(255,100,100,0.1)',
        color: allowed ? 'var(--accent-green)' : '#ff6464',
      }}
    >
      {allowed ? `⏱ ${timeLeft}` : '🔒 Encerrado'}
    </span>
  )
}

export default function MatchCard({ match, prediction, round }: Props) {
  const [homeScore, setHomeScore] = useState(prediction?.home_score_pred?.toString() ?? '')
  const [awayScore, setAwayScore] = useState(prediction?.away_score_pred?.toString() ?? '')
  const [penaltyWinner, setPenaltyWinner] = useState<'home' | 'away' | ''>(prediction?.penalty_winner_pred ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [deadlinePassed, setDeadlinePassed] = useState(() => !isPredictionAllowed(match.match_time))

  useEffect(() => {
    const msUntilDeadline = getDeadline(match.match_time).getTime() - Date.now()
    if (msUntilDeadline <= 0) return
    const timer = setTimeout(() => setDeadlinePassed(true), msUntilDeadline)
    return () => clearTimeout(timer)
  }, [match.match_time])

  const matchDate = new Date(match.match_time)
  const homeName = getTeamNamePTBR(match.home_team)
  const awayName = getTeamNamePTBR(match.away_team)
  const homeFlagUrl = getFlagUrl(match.home_team)
  const awayFlagUrl = getFlagUrl(match.away_team)

  async function handleSave() {
    if (deadlinePassed) return
    if (homeScore === '' || awayScore === '') {
      setError('Preencha os dois placares')
      return
    }

    const homeInt = parseInt(homeScore)
    const awayInt = parseInt(awayScore)

    if (isNaN(homeInt) || isNaN(awayInt) || homeInt < 0 || awayInt < 0) {
      setError('Placar inválido')
      return
    }

    const isDraw = homeInt === awayInt
    if (match.is_knockout && isDraw && !penaltyWinner) {
      setError('Selecione o vencedor nos pênaltis')
      return
    }

    setSaving(true)
    setError('')

    const formData = new FormData()
    formData.append('match_id', match.id)
    formData.append('home_score_pred', homeScore)
    formData.append('away_score_pred', awayScore)
    if (match.is_knockout && isDraw && penaltyWinner) {
      formData.append('penalty_winner_pred', penaltyWinner)
    }

    const result = await savePredictionAction(formData)
    setSaving(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: deadlinePassed ? 'var(--bg-border)' : 'var(--accent-green)',
        boxShadow: deadlinePassed ? 'none' : '0 0 12px rgba(0,230,118,0.15)',
      }}
    >
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b" style={{ borderColor: 'var(--bg-border)' }}>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {round?.name ?? ''} · {matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' })} {matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}
        </span>
        <div className="flex items-center gap-1.5">
          {!deadlinePassed && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Palpite fecha em</span>
          )}
          <CountdownTimer matchTime={match.match_time} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{homeName}</span>
              {homeFlagUrl && (
                <div className="w-8 h-6 rounded overflow-hidden shrink-0 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={homeFlagUrl} alt={homeName} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="number"
              min="0"
              max="99"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              disabled={deadlinePassed}
              className="font-bebas text-3xl text-center w-14 h-14 rounded-lg outline-none transition-all disabled:opacity-50"
              style={{
                backgroundColor: 'var(--bg-base)',
                border: '1px solid var(--bg-border)',
                color: 'var(--accent-yellow)',
              }}
              placeholder="0"
            />
            <span className="font-bebas text-2xl" style={{ color: 'var(--text-muted)' }}>×</span>
            <input
              type="number"
              min="0"
              max="99"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              disabled={deadlinePassed}
              className="font-bebas text-3xl text-center w-14 h-14 rounded-lg outline-none transition-all disabled:opacity-50"
              style={{
                backgroundColor: 'var(--bg-base)',
                border: '1px solid var(--bg-border)',
                color: 'var(--accent-yellow)',
              }}
              placeholder="0"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              {awayFlagUrl && (
                <div className="w-8 h-6 rounded overflow-hidden shrink-0 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={awayFlagUrl} alt={awayName} className="w-full h-full object-cover" />
                </div>
              )}
              <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{awayName}</span>
            </div>
          </div>
        </div>

        {match.is_knockout && homeScore !== '' && awayScore !== '' && parseInt(homeScore) === parseInt(awayScore) && !deadlinePassed && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--bg-border)' }}>
            <p className="text-xs text-center mb-2" style={{ color: 'var(--text-muted)' }}>
              Empate — quem avança nos pênaltis?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPenaltyWinner('home')}
                className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: penaltyWinner === 'home' ? 'rgba(0,230,118,0.15)' : 'var(--bg-base)',
                  border: `1px solid ${penaltyWinner === 'home' ? 'var(--accent-green)' : 'var(--bg-border)'}`,
                  color: penaltyWinner === 'home' ? 'var(--accent-green)' : 'var(--text-muted)',
                }}
              >
                {homeFlagUrl && <img src={homeFlagUrl} alt={homeName} className="inline w-5 h-4 object-cover rounded-sm mr-1" />}
                {homeName}
              </button>
              <button
                onClick={() => setPenaltyWinner('away')}
                className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: penaltyWinner === 'away' ? 'rgba(0,230,118,0.15)' : 'var(--bg-base)',
                  border: `1px solid ${penaltyWinner === 'away' ? 'var(--accent-green)' : 'var(--bg-border)'}`,
                  color: penaltyWinner === 'away' ? 'var(--accent-green)' : 'var(--text-muted)',
                }}
              >
                {awayFlagUrl && <img src={awayFlagUrl} alt={awayName} className="inline w-5 h-4 object-cover rounded-sm mr-1" />}
                {awayName}
              </button>
            </div>
          </div>
        )}

        {!deadlinePassed && (
          <div className="mt-3">
            {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60"
              style={{
                backgroundColor: saved ? 'rgba(0,230,118,0.15)' : 'var(--accent-green)',
                color: saved ? 'var(--accent-green)' : '#0D0F0E',
                border: saved ? '1px solid var(--accent-green)' : 'none',
              }}
            >
              {saving ? 'Salvando...' : saved ? '✓ Salvo!' : prediction ? 'Atualizar palpite' : 'Salvar palpite'}
            </button>
          </div>
        )}

        {deadlinePassed && match.status === 'finished' && match.home_score !== null && match.away_score !== null && (
          <div className="mt-3 pt-3 border-t flex items-center justify-center gap-2" style={{ borderColor: 'var(--bg-border)' }}>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Resultado:</span>
            <span className="font-bebas text-xl" style={{ color: 'var(--text-primary)' }}>
              {match.home_score} × {match.away_score}
            </span>
            {prediction?.points !== null && prediction?.points !== undefined && (
              <span
                className="text-sm font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(0,230,118,0.1)', color: 'var(--accent-green)' }}
              >
                {prediction.points} pts
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
