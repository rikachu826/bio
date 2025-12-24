import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Star field with thousands of stars
function Stars() {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const positions = new Float32Array(5000 * 3) // 5000 stars

    for (let i = 0; i < 5000; i++) {
      // Spread stars in a sphere
      const radius = 30 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }

    return positions
  }, [])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.05
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  )
}

// Constellation lines - connecting stars
function ConstellationLines() {
  const linesRef = useRef<THREE.LineSegments>(null)

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []

    // Create several constellation patterns
    const constellations = [
      // Big Dipper-like constellation
      [
        new THREE.Vector3(-15, 8, -20),
        new THREE.Vector3(-12, 10, -18),
        new THREE.Vector3(-9, 11, -19),
        new THREE.Vector3(-6, 10, -20),
        new THREE.Vector3(-5, 8, -18),
        new THREE.Vector3(-3, 6, -19),
        new THREE.Vector3(-1, 5, -20),
      ],
      // Orion-like constellation
      [
        new THREE.Vector3(10, 5, -25),
        new THREE.Vector3(12, 8, -24),
        new THREE.Vector3(14, 6, -26),
        new THREE.Vector3(12, 3, -25),
        new THREE.Vector3(10, 5, -25),
      ],
      // Random constellation 1
      [
        new THREE.Vector3(-8, -10, -22),
        new THREE.Vector3(-5, -12, -20),
        new THREE.Vector3(-2, -11, -23),
        new THREE.Vector3(1, -13, -21),
      ],
      // Random constellation 2
      [
        new THREE.Vector3(5, -5, -30),
        new THREE.Vector3(8, -3, -28),
        new THREE.Vector3(10, -6, -29),
        new THREE.Vector3(7, -8, -31),
        new THREE.Vector3(5, -5, -30),
      ],
    ]

    constellations.forEach(constellation => {
      for (let i = 0; i < constellation.length - 1; i++) {
        points.push(constellation[i])
        points.push(constellation[i + 1])
      }
    })

    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color="#667eea"
        transparent
        opacity={0.3}
        linewidth={1}
      />
    </lineSegments>
  )
}

// Shooting stars
function ShootingStar({ delay = 0 }: { delay?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const startTime = useRef(Date.now() + delay * 1000)

  useFrame(() => {
    if (ref.current && ref.current.material) {
      const elapsed = (Date.now() - startTime.current) / 1000
      const duration = 2
      const progress = (elapsed % (duration + 3)) / duration // 2s animation, 3s pause

      if (progress <= 1) {
        const x = -30 + progress * 60
        const y = 20 - progress * 40
        const z = -30 + progress * 10

        ref.current.position.set(x, y, z)
        if (!Array.isArray(ref.current.material)) {
          ref.current.material.opacity = Math.sin(progress * Math.PI) * 0.8
        }
      } else {
        if (!Array.isArray(ref.current.material)) {
          ref.current.material.opacity = 0
        }
      }
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} />
    </mesh>
  )
}

// Main starfield component
export default function Starfield() {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]} // Limit DPR for performance
    >
      <color attach="background" args={['#000000']} />

      {/* Ambient star field */}
      <Stars />

      {/* Constellation lines */}
      <ConstellationLines />

      {/* Shooting stars (3 with staggered delays) */}
      <ShootingStar delay={0} />
      <ShootingStar delay={5} />
      <ShootingStar delay={10} />

      {/* Soft ambient light */}
      <ambientLight intensity={0.2} />
    </Canvas>
  )
}
