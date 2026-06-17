'use client'

import { useState, useEffect } from 'react'

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

type Status = 'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed' | 'needs-install'

export default function PushNotificationManager() {
  const [status, setStatus] = useState<Status>('loading')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      setStatus(isIOS && !isStandalone ? 'needs-install' : 'unsupported')
      return
    }

    if (Notification.permission === 'denied') {
      setStatus('denied')
      return
    }

    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        setStatus(sub ? 'subscribed' : 'unsubscribed')
      })
    })
  }, [])

  async function subscribe() {
    setError(null)
    setBusy(true)
    try {
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) {
        setError('Chave VAPID não configurada no servidor.')
        return
      }

      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
      // Wait for the SW to be active (may need a page reload on first install)
      const activeReg = await navigator.serviceWorker.ready

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus('denied')
        return
      }

      const sub = await activeReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      })

      if (!res.ok) {
        setError('Erro ao salvar assinatura. Tente novamente.')
        return
      }

      setStatus('subscribed')
    } catch (err: any) {
      console.error('Push subscribe error:', err)
      if (err?.name === 'NotAllowedError') {
        setStatus('denied')
      } else {
        setError('Não foi possível ativar as notificações. Verifique se o app está instalado na tela inicial.')
      }
    } finally {
      setBusy(false)
    }
  }

  async function unsubscribe() {
    setError(null)
    setBusy(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setStatus('unsubscribed')
    } catch (err) {
      console.error('Push unsubscribe error:', err)
      setError('Erro ao desativar. Tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  if (status === 'loading') return null

  if (status === 'needs-install') {
    return (
      <div
        className="rounded-lg p-4 text-sm"
        style={{ backgroundColor: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)' }}
      >
        <p className="font-medium mb-1" style={{ color: 'var(--accent-green)' }}>
          Ativar no iPhone
        </p>
        <p style={{ color: 'var(--text-muted)' }}>
          Toque em <strong style={{ color: 'var(--text-primary)' }}>Compartilhar</strong> →{' '}
          <strong style={{ color: 'var(--text-primary)' }}>Adicionar à Tela de Início</strong> e
          abra o app por lá para receber notificações.
        </p>
      </div>
    )
  }

  if (status === 'unsupported') {
    return (
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Notificações push não suportadas neste navegador.
      </p>
    )
  }

  if (status === 'denied') {
    return (
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Permissão bloqueada. Habilite notificações nas configurações do navegador e recarregue a página.
      </p>
    )
  }

  const isOn = status === 'subscribed'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Notificações push
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {isOn ? 'Ativo neste dispositivo' : 'Desativado neste dispositivo'}
          </p>
        </div>
        <button
          onClick={isOn ? unsubscribe : subscribe}
          disabled={busy}
          aria-label={isOn ? 'Desativar notificações' : 'Ativar notificações'}
          className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-40"
          style={{ backgroundColor: isOn ? 'var(--accent-green)' : 'var(--bg-border)' }}
        >
          <span
            className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
            style={{ transform: isOn ? 'translateX(1.375rem)' : 'translateX(0.125rem)' }}
          />
        </button>
      </div>

      {error && (
        <p className="text-xs" style={{ color: '#ff5252' }}>
          {error}
        </p>
      )}
    </div>
  )
}
