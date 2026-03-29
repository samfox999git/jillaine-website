import { Warp } from '@paper-design/shaders-react'

export default function WarpHero() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Warp
          style={{ height: '100%', width: '100%' }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={0.6}
          colors={['#050f0a', '#1aab87', '#0d2e1e', '#000000', '#2dd4a8', '#0a4a30']}
        />
      </div>
      {/* Dark overlay to keep text legible */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.72)',
        pointerEvents: 'none',
      }} />
    </>
  )
}
