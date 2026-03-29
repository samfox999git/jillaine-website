import { useEffect, useRef } from 'react'

export default function AuroraHero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrame
    let t = 0

    function resize() {
      const parent = canvas.parentElement
      const w = (parent?.offsetWidth  || window.innerWidth)
      const h = (parent?.offsetHeight || window.innerHeight)
      canvas.width  = w * window.devicePixelRatio
      canvas.height = h * window.devicePixelRatio
      canvas.style.width  = w + 'px'
      canvas.style.height = h + 'px'
    }

    // Defer first resize so the hero section is fully laid out
    requestAnimationFrame(resize)
    window.addEventListener('resize', resize)

    // Restart loop if the tab was backgrounded and came back
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        cancelAnimationFrame(animationFrame)
        animate()
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    const W = () => canvas.width
    const H = () => canvas.height

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.75,
      r: 0.3 + Math.random() * 1.2,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.013,
      baseBright: 0.25 + Math.random() * 0.55,
    }))

    // Aurora arms — teal, green, blue, purple tones
    const arms = [
      { cx: 0.20, cy: 0.18, rx: 0.52, ry: 0.28, speed: 0.05,  phase: 0.0,  hue: 155, bright: 0.80 },
      { cx: 0.38, cy: 0.12, rx: 0.45, ry: 0.24, speed: 0.04,  phase: 1.4,  hue: 163, bright: 0.65 },
      { cx: 0.14, cy: 0.32, rx: 0.40, ry: 0.20, speed: 0.06,  phase: 2.6,  hue: 220, bright: 0.40 }, // blue
      { cx: 0.48, cy: 0.22, rx: 0.36, ry: 0.18, speed: 0.045, phase: 0.7,  hue: 148, bright: 0.55 },
      { cx: 0.26, cy: 0.08, rx: 0.48, ry: 0.22, speed: 0.035, phase: 3.0,  hue: 158, bright: 0.42 },
      { cx: 0.08, cy: 0.25, rx: 0.30, ry: 0.16, speed: 0.055, phase: 1.9,  hue: 280, bright: 0.30 }, // purple
      { cx: 0.35, cy: 0.30, rx: 0.32, ry: 0.15, speed: 0.042, phase: 4.1,  hue: 200, bright: 0.35 }, // blue-teal
    ]

    function drawSky() {
      const grad = ctx.createLinearGradient(0, 0, 0, H())
      grad.addColorStop(0.00, '#000407')
      grad.addColorStop(0.35, '#00080d')
      grad.addColorStop(0.70, '#000c10')
      grad.addColorStop(1.00, '#000608')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W(), H())
    }

    function drawStars() {
      stars.forEach(s => {
        s.twinkle += s.speed
        const auroraProx = Math.max(0, 1 - s.x * 2.2) * Math.max(0, 1 - s.y * 2.0)
        const alpha = (s.baseBright + Math.sin(s.twinkle) * 0.28) * (1 - auroraProx * 0.72)
        if (alpha < 0.02) return
        ctx.beginPath()
        ctx.arc(s.x * W(), s.y * H(), s.r * window.devicePixelRatio, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(215, 240, 255, ${alpha})`
        ctx.fill()
        if (s.baseBright > 0.72 && alpha > 0.45) {
          const cr = s.r * 3 * window.devicePixelRatio
          ctx.strokeStyle = `rgba(215, 240, 255, ${alpha * 0.35})`
          ctx.lineWidth = 0.5 * window.devicePixelRatio
          ctx.beginPath()
          ctx.moveTo(s.x * W() - cr, s.y * H())
          ctx.lineTo(s.x * W() + cr, s.y * H())
          ctx.moveTo(s.x * W(), s.y * H() - cr)
          ctx.lineTo(s.x * W(), s.y * H() + cr)
          ctx.stroke()
        }
      })
    }

    function drawAuroraArm(arm) {
      const w = W(), h = H()
      const cx = (arm.cx + Math.sin(t * arm.speed + arm.phase) * 0.16) * w
      const cy = (arm.cy + Math.cos(t * arm.speed * 0.6 + arm.phase) * 0.09) * h
      const rx = arm.rx * w
      const ry = arm.ry * h
      const angle = Math.sin(t * arm.speed * 0.5 + arm.phase) * 0.55
      const pulse = 0.75 + Math.sin(t * arm.speed * 2.2 + arm.phase) * 0.25

      // Horizontal edge fade
      const normX = cx / w
      const hFade = Math.min(
        Math.max(0, (normX - 0.0) / 0.28),
        Math.max(0, (1.0 - normX) / 0.28),
        1.0
      )
      const fadeB = arm.bright * Math.pow(hFade, 0.6)

      // Use scale transform so the radial gradient and the arc share the same
      // circular coordinate space — gradient reaches 0 before the arc edge,
      // giving a fully soft dissolve with no hard clipping.
      const scaleY = (ry * 1.8) / (rx * 2.0)

      // Outer mist
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.scale(1.0, scaleY)
      const g0 = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 2.0)
      g0.addColorStop(0.0,  `hsla(${arm.hue}, 80%, 50%, ${0.12 * pulse * fadeB})`)
      g0.addColorStop(0.25, `hsla(${arm.hue}, 76%, 44%, ${0.08 * pulse * fadeB})`)
      g0.addColorStop(0.55, `hsla(${arm.hue}, 72%, 38%, ${0.03 * pulse * fadeB})`)
      g0.addColorStop(0.80, `hsla(${arm.hue}, 68%, 30%, ${0.008 * pulse * fadeB})`)
      g0.addColorStop(1.0,  `hsla(${arm.hue}, 60%, 25%, 0)`)
      ctx.fillStyle = g0
      ctx.beginPath()
      ctx.arc(0, 0, rx * 2.4, 0, Math.PI * 2) // larger than gradient outer radius
      ctx.fill()
      ctx.restore()

      // Inner glow — same technique
      const scaleY2 = (ry * 1.0) / (rx * 1.1)
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.scale(1.0, scaleY2)
      const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 1.1)
      g1.addColorStop(0.0,  `hsla(${arm.hue}, 90%, 62%, ${0.32 * pulse * fadeB})`)
      g1.addColorStop(0.30, `hsla(${arm.hue}, 85%, 52%, ${0.14 * pulse * fadeB})`)
      g1.addColorStop(0.58, `hsla(${arm.hue}, 78%, 40%, ${0.04 * pulse * fadeB})`)
      g1.addColorStop(0.80, `hsla(${arm.hue}, 70%, 30%, ${0.008 * pulse * fadeB})`)
      g1.addColorStop(1.0,  `hsla(${arm.hue}, 60%, 25%, 0)`)
      ctx.fillStyle = g1
      ctx.beginPath()
      ctx.arc(0, 0, rx * 1.4, 0, Math.PI * 2) // larger than gradient outer radius
      ctx.fill()
      ctx.restore()
    }

    function animate() {
      t += 0.008
      ctx.clearRect(0, 0, W(), H())
      drawSky()
      drawStars()

      ctx.globalCompositeOperation = 'screen'
      arms.forEach(drawAuroraArm)
      ctx.globalCompositeOperation = 'source-over'

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
