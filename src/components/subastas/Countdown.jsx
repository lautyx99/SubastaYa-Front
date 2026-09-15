import { useEffect, useState } from 'react'

function Countdown({ fechaFin }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const fin = new Date(fechaFin).getTime()
  const diff = Number.isFinite(fin) ? Math.max(0, fin - now) : 0

  const totalSec = Math.floor(diff / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60

  const critico = totalSec > 0 && totalSec <= 60
  const urgente = totalSec > 60 && totalSec <= 600

  const background = !Number.isFinite(fin)
    ? '#94a3b8'
    : diff === 0
      ? '#94a3b8'
      : critico
        ? '#EF4444'
        : urgente
          ? '#F59E0B'
          : '#10B981'

  const partes = []
  if (h > 0) partes.push(`${h} hr`)
  partes.push(`${m} min`)
  partes.push(`${s} seg`)
  const texto = diff === 0 ? 'Finalizada' : partes.join(' ')

  return (
    <div
      className="rounded-3 text-center p-3 mb-3"
      style={{
        background,
        color: '#fff',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <div className="small mb-1" style={{ opacity: 0.9 }}>
        {critico ? 'Zona crítica' : urgente ? 'Tiempo limitado' : 'Tiempo restante'}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{texto}</div>
    </div>
  )
}

export default Countdown