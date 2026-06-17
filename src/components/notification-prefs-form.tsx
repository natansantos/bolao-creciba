'use client'

import { useState } from 'react'
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
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      </div>
      {/* hidden input carries the value on form submit */}
      <input type="hidden" name={name} value={checked ? 'on' : 'off'} />
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked(v => !v)}
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
        style={{ backgroundColor: checked ? 'var(--accent-green)' : 'var(--bg-border)' }}
      >
        <span
          className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
          style={{ transform: checked ? 'translateX(1.375rem)' : 'translateX(0.125rem)' }}
        />
      </button>
    </div>
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
