import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Palpiteiros Copa do Mundo 2026',
  description: 'Bolão da Copa do Mundo 2026',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        {children}
      </body>
    </html>
  )
}
