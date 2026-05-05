import { useState, useRef, useEffect } from 'react'
import './BeforeAfter.css'

export default function BeforeAfter({ beforeSrc, afterSrc, beforeAlt = 'Before', afterAlt = 'After', autoDemo = false }) {
  const [sliderPos, setSliderPos] = useState(50)
  const [showHint, setShowHint] = useState(autoDemo)
  const containerRef = useRef(null)
  const bottomSentinelRef = useRef(null)
  const isDragging = useRef(false)
  const animCancelled = useRef(false)

  useEffect(() => {
    if (!autoDemo) return
    const el = containerRef.current
    if (!el) return

    let animFrame
    let timer

    const keyframes = [[0, 50], [700, 78], [1500, 22], [2200, 50]]

    const runAnimation = () => {
      let startTime = null
      const animate = (timestamp) => {
        if (animCancelled.current) { setShowHint(false); return }
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const last = keyframes[keyframes.length - 1]
        if (elapsed >= last[0]) {
          setSliderPos(last[1])
          setShowHint(false)
          return
        }
        let pos = 50
        for (let i = 0; i < keyframes.length - 1; i++) {
          const [t0, p0] = keyframes[i]
          const [t1, p1] = keyframes[i + 1]
          if (elapsed >= t0 && elapsed < t1) {
            const t = (elapsed - t0) / (t1 - t0)
            const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
            pos = p0 + (p1 - p0) * ease
            break
          }
        }
        setSliderPos(pos)
        animFrame = requestAnimationFrame(animate)
      }
      timer = setTimeout(() => { animFrame = requestAnimationFrame(animate) }, 600)
    }

    const sentinel = bottomSentinelRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          runAnimation()
        }
      },
      { threshold: 0 }
    )
    if (sentinel) observer.observe(sentinel)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(animFrame)
    }
  }, [autoDemo])

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(pct)
  }

  const handleMouseDown = () => { isDragging.current = true; animCancelled.current = true }
  const handleMouseUp = () => { isDragging.current = false }
  const handleMouseMove = (e) => {
    if (isDragging.current) handleMove(e.clientX)
  }

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX)
  }

  return (
    <div
      className="before-after"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={() => { isDragging.current = true; animCancelled.current = true }}
      onTouchEnd={() => isDragging.current = false}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuenow={Math.round(sliderPos)}
    >
      {/* After Image (full) */}
      <img src={afterSrc} alt={afterAlt} className="ba-image ba-after" loading="lazy" />

      {/* Before Image (clipped) */}
      <div className="ba-before-clip" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
        <img src={beforeSrc} alt={beforeAlt} className="ba-image ba-before" loading="lazy" />
      </div>

      {/* Slider Line */}
      <div className="ba-slider-line" style={{ left: `${sliderPos}%` }}>
        <div className="ba-slider-handle">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 10L2 10M2 10L5 7M2 10L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 10L18 10M18 10L15 7M18 10L15 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="ba-label ba-label-before" style={{ opacity: sliderPos > 15 ? 1 : 0 }}>Before</span>
      <span className="ba-label ba-label-after" style={{ opacity: sliderPos < 85 ? 1 : 0 }}>After</span>

      {/* Bottom sentinel — triggers animation when bottom of image enters viewport */}
      <div ref={bottomSentinelRef} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', pointerEvents: 'none' }} />

      {/* Drag hint */}
      {autoDemo && (
        <div className={`ba-hint ${showHint ? 'ba-hint--visible' : ''}`}>
          <svg className="ba-hint-arrow ba-hint-arrow--left" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M18 10H2M2 10L8 4M2 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ba-hint-center">Reveal</span>
          <svg className="ba-hint-arrow ba-hint-arrow--right" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M2 10H18M18 10L12 4M18 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  )
}
