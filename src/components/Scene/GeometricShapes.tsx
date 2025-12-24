import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Octahedron } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import { Mesh, Points as ThreePoints } from 'three'
import { useFrame } from '@react-three/fiber'

// Individual floating shape component
function FloatingShape({
  position,
  geometry = 'sphere',
  color,
  scale = 1
}: {
  position: [number, number, number]
  geometry?: 'sphere' | 'box' | 'octahedron'
  color: string
  scale?: number
}) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x += 0.001
      meshRef.current.rotation.y += 0.002

      // Mouse interaction - subtle movement
      const x = state.mouse.x * 0.5
      const y = state.mouse.y * 0.5
      meshRef.current.position.x = position[0] + x
      meshRef.current.position.y = position[1] + y
    }
  })

  const ShapeComponent = useMemo(() => {
    switch (geometry) {
      case 'box':
        return Box
      case 'octahedron':
        return Octahedron
      default:
        return Sphere
    }
  }, [geometry])

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={1}
    >
      <ShapeComponent ref={meshRef} args={[scale]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.4}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </ShapeComponent>
    </Float>
  )
}

// Particle field component
function ParticleField() {
  const particlesRef = useRef<ThreePoints>(null)

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#667eea"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Main scene component
export default function GeometricShapes() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#667eea" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#764ba2" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} color="#4facfe" />

      {/* Floating geometric shapes */}
      <FloatingShape position={[-2, 2, 0]} geometry="sphere" color="#667eea" scale={1.2} />
      <FloatingShape position={[3, -1, -2]} geometry="box" color="#764ba2" scale={0.8} />
      <FloatingShape position={[-3, -2, -1]} geometry="octahedron" color="#4facfe" scale={1} />
      <FloatingShape position={[2, 1, -3]} geometry="sphere" color="#f093fb" scale={0.6} />
      <FloatingShape position={[0, -3, -2]} geometry="box" color="#00f2fe" scale={0.9} />

      {/* Particle field background */}
      <ParticleField />

      {/* Subtle orbit controls (user can rotate the scene) */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}
