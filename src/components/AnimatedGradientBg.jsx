import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './AnimatedGradientBg.css'

export default function AnimatedGradientBg({
  startingGap = 125,
  breathing = false,
  gradientColors = [
    '#0A0A0A',
    '#c0392b',
    '#b8963e',
    '#2dd4a8',
    '#a855f7',
    '#22d3ee',
    '#0d0d0d'
  ],
  gradientStops = [20, 40, 55, 65, 75, 88, 100],
  animationSpeed = 0.02,
  breathingRange = 5,
  topOffset = 0,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    let animationFrame
    let width = startingGap
    let directionWidth = 1

    const animateGradient = () => {
      if (width >= startingGap + breathingRange) directionWidth = -1
      if (width <= startingGap - breathingRange) directionWidth = 1

      if (!breathing) directionWidth = 0
      width += directionWidth * animationSpeed

      const gradientStopsString = gradientStops
        .map((stop, index) => `${gradientColors[index]} ${stop}%`)
        .join(', ')

      const gradient = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${gradientStopsString})`

      if (containerRef.current) {
        containerRef.current.style.background = gradient
      }

      animationFrame = requestAnimationFrame(animateGradient)
    }

    animationFrame = requestAnimationFrame(animateGradient)
    return () => cancelAnimationFrame(animationFrame)
  }, [startingGap, breathing, gradientColors, gradientStops, animationSpeed, breathingRange, topOffset])

  return (
    <motion.div
      className={`animated-gradient-bg ${className}`}
      initial={{ opacity: 0, scale: 1.5 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 2, ease: [0.25, 0.1, 0.25, 1] }
      }}
    >
      <div
        ref={containerRef}
        className="animated-gradient-inner"
        style={style}
      />
    </motion.div>
  )
}
