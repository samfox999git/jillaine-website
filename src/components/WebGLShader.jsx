import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function WebGLShader({ className = '' }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const refs = sceneRef.current

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float wave1 = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float wave2 = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float wave3 = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

        // Site palette: teal #2dd4a8, cyan #22d3ee, purple #a855f7
        vec3 teal   = vec3(0.176, 0.831, 0.659);
        vec3 cyan   = vec3(0.133, 0.827, 0.933);
        vec3 purple = vec3(0.659, 0.333, 0.969);

        vec3 color = wave1 * teal + wave2 * cyan + wave3 * purple;

        gl_FragColor = vec4(color, 1.0);
      }
    `

    const container = canvas.parentElement
    const getSize = () => ({
      width: container ? container.offsetWidth : window.innerWidth,
      height: container ? container.offsetHeight : window.innerHeight,
    })

    refs.scene = new THREE.Scene()
    refs.renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
    refs.renderer.setPixelRatio(window.devicePixelRatio)
    refs.renderer.setClearColor(new THREE.Color(0x000000), 0)

    refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

    const { width, height } = getSize()

    refs.uniforms = {
      resolution: { value: [width, height] },
      time: { value: 0.0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.5 },
      distortion: { value: 0.05 },
    }

    const position = [
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0,
    ]

    const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', positions)

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: refs.uniforms,
      side: THREE.DoubleSide,
    })

    refs.mesh = new THREE.Mesh(geometry, material)
    refs.scene.add(refs.mesh)

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const { width, height } = getSize()
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    handleResize()

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.01
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    animate()
    window.addEventListener('resize', handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener('resize', handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} style={{ display: 'block', width: '100%', height: '100%' }} />
}
