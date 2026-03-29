import { useState, useRef } from 'react'
import './BeforeAfter.css'

export default function BeforeAfter({ beforeSrc, afterSrc, beforeAlt = 'Before', afterAlt = 'After' }) {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef(null)
  const isDragging = useRef(false)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(pct)
  }

  const handleMouseDown = () => { isDragging.current = true }
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
      onTouchStart={() => isDragging.current = true}
      onTouchEnd={() => isDragging.current = false}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuenow={Math.round(sliderPos)}
    >
      {/* After Image (full) */}
      <img src={afterSrc} alt={afterAlt} className="ba-image ba-after" />

      {/* Before Image (clipped) */}
      <div className="ba-before-clip" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
        <img src={beforeSrc} alt={beforeAlt} className="ba-image ba-before" />
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
    </div>
  )
}
