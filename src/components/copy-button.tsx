'use client'

import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 text-xs px-2 py-1 rounded-lg transition-colors"
      style={{
        border: '1px solid var(--bg-border)',
        color: copied ? 'var(--accent-green)' : 'var(--text-muted)',
      }}
    >
      {copied ? '✓ Copiado' : 'Copiar'}
    </button>
  )
}
