'use client'

import { useActionState } from 'react'
import { updateNotificationPrefsAction } from '@/lib/actions/notifications'

interface Props {
  notifyDeadline: boolean
  notifyResult: boolean
  notifyRoundSummary: boolean
}

function Toggle({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string
  label: string
  description: string
  defaultChecked: boolean
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      </div>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="sr-only peer"
      />
      <div
        className="relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors peer-checked:bg-[var(--accent-green)]"
        style={{ backgroundColor: 'var(--bg-border)' }}
        aria-hidden="true"
      >
        <span className="inline-block h-4 w-4 m-1 rounded-full bg-white transition-transform peer-group-checked:translate-x-5" />
      </div>
    </label>
  )
}

export default function NotificationPrefsForm({ notifyDeadline, notifyResult, notifyRoundSummary }: Props) {
  const [state, action, pending] = useActionState(updateNotificationPrefsAction, { error: null })

  return (
    <form action={action} className="space-y-4">
      <Toggle
        name="notify_deadline"
        label="Prazo encerrando"
        description="Aviso 30 min antes de fechar o palpite de um jogo"
        defaultChecked={notifyDeadline}
      />
      <Toggle
        name="notify_result"
        label="Resultado do jogo"
        description="Sua pontuação quando um jogo terminar"
        defaultChecked={notifyResult}
      />
      <Toggle
        name="notify_round_summary"
        label="Resumo da rodada"
        description="Pontuação total quando todos os jogos da rodada terminarem"
        defaultChecked={notifyRoundSummary}
      />

      {state?.error && (
        <p className="text-sm" style={{ color: '#ff5252' }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
        style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
      >
        {pending ? 'Salvando…' : 'Salvar preferências'}
      </button>
    </form>
  )
}
