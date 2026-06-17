'use client'

import { useState, useEffect } from 'react'

type Platform = 'android' | 'ios' | null

export default function PwaInstallBanner() {
  const [platform, setPlatform] = useState<Platform>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (sessionStorage.getItem('pwa-banner-dismissed')) return

    const ua = navigator.userAgent
    const isIOS = /iphone|ipad|ipod/i.test(ua)
    const isAndroid = /android/i.test(ua)

    if (!isIOS && !isAndroid) return

    // Register SW proactively so Chrome can evaluate installability criteria
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
    }

    // Show banner immediately — don't wait for beforeinstallprompt
    setPlatform(isIOS ? 'ios' : 'android')

    if (isAndroid) {
      // Capture native prompt if Chrome offers it (may fire later or not at all)
      const handler = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  function dismiss() {
    sessionStorage.setItem('pwa-banner-dismissed', '1')
    setDismissed(true)
  }

  async function install() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setDismissed(true)
      setDeferredPrompt(null)
    }
  }

  if (!platform || dismissed) return null

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-3 right-3 z-50 rounded-xl p-4 shadow-lg flex gap-3"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--bg-border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
        style={{ backgroundColor: '#0D0F0E', color: 'var(--accent-green)' }}
      >
        P
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Instale o Palpiteiros
        </p>

        {platform === 'ios' && (
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Toque em <ShareIcon />{' '}
            <span style={{ color: 'var(--text-primary)' }}>Compartilhar</span> →{' '}
            <span style={{ color: 'var(--text-primary)' }}>Adicionar à Tela de Início</span>{' '}
            para receber notificações.
          </p>
        )}

        {platform === 'android' && (
          <>
            {deferredPrompt ? (
              <>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Instale para receber notificações de palpites e resultados.
                </p>
                <button
                  onClick={install}
                  className="mt-2 px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{ backgroundColor: 'var(--accent-green)', color: '#0D0F0E' }}
                >
                  Instalar app
                </button>
              </>
            ) : (
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Toque nos{' '}
                <span style={{ color: 'var(--text-primary)' }}>⋮ três pontos</span> do Chrome →{' '}
                <span style={{ color: 'var(--text-primary)' }}>Adicionar à tela inicial</span>{' '}
                para receber notificações.
              </p>
            )}
          </>
        )}
      </div>

      <button
        onClick={dismiss}
        className="shrink-0 text-xl leading-none self-start"
        style={{ color: 'var(--text-muted)' }}
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  )
}

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block w-3.5 h-3.5 align-text-bottom"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  )
}
