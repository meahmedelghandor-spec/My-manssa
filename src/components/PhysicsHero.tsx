'use client'

import { useEffect, useRef } from 'react'

const EQUATIONS = [
  'E = mc²',
  'F = ma',
  'λ = h/p',
  'E = hf',
  'ΔpΔx ≥ ℏ/2',
  '∇·E = ρ/ε₀',
  'F = G(m₁m₂/r²)',
  'v = fλ',
  'PV = nRT',
  'τ = Iα',
  'W = ΔKE',
  'c = 3×10⁸',
]

type Orbit = {
  eq: string
  radiusX: number
  radiusY: number
  speed: number
  angle: number
  tilt: number
  colorIndex: number
  size: number
}

const COLORS = [
  { r: 99,  g: 102, b: 241 }, // indigo
  { r: 6,   g: 182, b: 212 }, // cyan
  { r: 245, g: 158, b: 11  }, // amber
]

function makeOrbits(): Orbit[] {
  return EQUATIONS.map((eq, i) => {
    const layer = i % 3
    return {
      eq,
      radiusX: 190 + layer * 55,
      radiusY: 68 + layer * 22,
      speed: (0.004 + (i % 5) * 0.0012) * (i % 2 === 0 ? 1 : -1),
      angle: (i / EQUATIONS.length) * Math.PI * 2,
      tilt: (layer * 20 * Math.PI) / 180,
      colorIndex: i % 3,
      size: 20 + layer * 3,       // bigger equations
    }
  })
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  orbits: Orbit[],
  cx: number,
  cy: number,
  drawFront: boolean   // true = only draw front equations (sin>0), false = only back (sin<0)
) {
  orbits.forEach(orb => {
    const sinA = Math.sin(orb.angle)
    const isFront = sinA > 0

    // Skip equations that belong to the other layer
    if (drawFront !== isFront) return

    const x = cx + orb.radiusX * Math.cos(orb.angle)
    const y = cy + orb.radiusY * sinA

    // Depth-based alpha & scale
    const depth = (sinA + 1) / 2                     // 0 (back) → 1 (front)
    const alpha  = drawFront ? 0.55 + depth * 0.45 : 0.18 + (1 - depth) * 0.25
    const scale  = drawFront ? 0.9 + depth * 0.2 : 0.7 + (1 - depth) * 0.15

    const c = COLORS[orb.colorIndex]

    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)
    ctx.font = `bold ${orb.size}px "Courier New", monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    if (drawFront) {
      ctx.shadowColor = `rgba(${c.r},${c.g},${c.b},0.9)`
      ctx.shadowBlur = 16
    }

    ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`
    ctx.fillText(orb.eq, 0, 0)
    ctx.restore()
  })
}

export default function PhysicsHero() {
  const backCanvasRef  = useRef<HTMLCanvasElement>(null)
  const frontCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const back  = backCanvasRef.current
    const front = frontCanvasRef.current
    if (!back || !front) return
    const bCtx = back.getContext('2d')
    const fCtx = front.getContext('2d')
    if (!bCtx || !fCtx) return

    const orbits = makeOrbits()
    let animId: number

    function resize() {
      if (!back || !front) return
      back.width  = back.offsetWidth
      back.height = back.offsetHeight
      front.width  = front.offsetWidth
      front.height = front.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function step() {
      if (!back || !front) return
      const W  = back.width
      const H  = back.height
      const cx = W / 2
      const cy = H / 2

      // --- Back canvas (equations behind image) ---
      bCtx.clearRect(0, 0, W, H)

      // Faint orbit ellipses
      for (let i = 0; i < 3; i++) {
        bCtx.beginPath()
        bCtx.ellipse(cx, cy, 190 + i * 55, 68 + i * 22, 0, 0, Math.PI * 2)
        bCtx.strokeStyle = `rgba(99,102,241,${0.07 - i * 0.015})`
        bCtx.lineWidth = 1
        bCtx.setLineDash([5, 14])
        bCtx.stroke()
        bCtx.setLineDash([])
      }

      drawLayer(bCtx, orbits, cx, cy, false)   // back equations

      // --- Front canvas (equations in front of image) ---
      fCtx.clearRect(0, 0, W, H)
      drawLayer(fCtx, orbits, cx, cy, true)    // front equations

      // Advance angles
      orbits.forEach(orb => { orb.angle += orb.speed })

      animId = requestAnimationFrame(step)
    }

    step()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  }

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: 520 }}>

      {/* ── Layer 0: back canvas (equations BEHIND image) ── */}
      <canvas ref={backCanvasRef} style={{ ...canvasStyle, zIndex: 0 }} />

      {/* ── Layer 1: ambient glow blobs ── */}
      <div style={{
        position: 'absolute',
        width: 420, height: 420,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, rgba(99,102,241,0.16) 0%, rgba(6,182,212,0.09) 50%, transparent 75%)',
        filter: 'blur(36px)',
        zIndex: 1,
        animation: 'float 7s ease-in-out infinite',
      }} />

      {/* ── Layer 2: glass-framed image ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        borderRadius: '2rem',
        padding: '6px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(99,102,241,0.12) 60%, rgba(6,182,212,0.12) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 60px rgba(99,102,241,0.16), 0 0 0 1px rgba(255,255,255,0.5) inset',
        animation: 'float 6s ease-in-out infinite',
      }}>
        <img
          src="/images/physics-hero.png"
          alt="Physics Professor"
          style={{
            width: '100%',
            maxWidth: 450,
            borderRadius: '1.7rem',
            display: 'block',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
          }}
        />
      </div>

      {/* ── Layer 3: front canvas (equations IN FRONT of image) ── */}
      <canvas ref={frontCanvasRef} style={{ ...canvasStyle, zIndex: 3 }} />

      {/* ── Accent dots ── */}
      {[
        { top: '10%', left: '8%' },
        { top: '14%', right: '6%' },
        { bottom: '12%', left: '12%' },
        { bottom: '10%', right: '9%' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', ...pos,
          width: 9, height: 9,
          borderRadius: '50%',
          background: i % 2 === 0 ? 'rgba(99,102,241,0.55)' : 'rgba(6,182,212,0.55)',
          boxShadow: '0 0 12px currentColor',
          animation: `pulse ${2 + i * 0.6}s ease-in-out infinite`,
          zIndex: 4,
        }} />
      ))}
    </div>
  )
}
