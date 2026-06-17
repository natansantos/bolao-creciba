import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const size = searchParams.get('size') === '512' ? 512 : 192
  const fontSize = Math.round(size * 0.45)

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: '#0D0F0E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: size * 0.18,
        }}
      >
        <span
          style={{
            fontFamily: 'serif',
            fontSize,
            fontWeight: 900,
            color: '#00E676',
            letterSpacing: '-2px',
          }}
        >
          P
        </span>
      </div>
    ),
    { width: size, height: size }
  )
}
