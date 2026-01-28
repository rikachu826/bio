import { useRef, useEffect } from 'react'

type GalaxyBackgroundProps = {
  paused?: boolean
}

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  width: number
  height: number
  baseX: number
  baseY: number
  density: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.baseX = this.x
    this.baseY = this.y
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.size = Math.random() * 2 + 1
    this.density = (Math.random() * 30) + 1
  }

  update(mouse: { x: number | null, y: number | null }, delta = 1) {
    // Mouse interaction
    if (mouse.x != null && mouse.y != null) {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const forceDirectionX = dx / distance
      const forceDirectionY = dy / distance

      // Repel radius
      const maxDistance = 150
      const force = (maxDistance - distance) / maxDistance

      // If mouse is close, particles move away
      if (distance < maxDistance) {
        const directionX = forceDirectionX * force * this.density * delta
        const directionY = forceDirectionY * force * this.density * delta
        this.x -= directionX
        this.y -= directionY
      } else {
        // Return to base drift
        if (this.x !== this.baseX) {
          const dx = this.x - this.baseX
          this.x -= (dx / 10) * delta
        }
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY
          this.y -= (dy / 10) * delta
        }
      }
    }

    // Base movement
    this.baseX += this.vx * delta
    this.baseY += this.vy * delta

    // Wrap around
    if (this.baseX < 0) this.baseX = this.width
    if (this.baseX > this.width) this.baseX = 0
    if (this.baseY < 0) this.baseY = this.height
    if (this.baseY > this.height) this.baseY = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

export default function GalaxyBackground({ paused = false }: GalaxyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef<{ x: number | null, y: number | null }>({ x: null, y: null })
  const pausedRef = useRef(paused)
  const pauseControlRef = useRef<(shouldPause: boolean) => void>(() => {})

  useEffect(() => {
    pausedRef.current = paused
    pauseControlRef.current?.(paused || document.hidden)
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let width = window.innerWidth
    let height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = Math.min(300, Math.floor((width * height) / 12000))
    const maxDistance = 100
    const maxDistanceSq = maxDistance * maxDistance
    const cellSize = maxDistance
    let cols = Math.ceil(width / cellSize)
    let rows = Math.ceil(height / cellSize)
    let grid: number[][] = Array.from({ length: cols * rows }, () => [])
    let lastFrameTime = 0
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency ?? 6 : 6
    const memory = typeof navigator !== 'undefined' ? (navigator as { deviceMemory?: number }).deviceMemory ?? 4 : 4
    const targetFps = cores >= 10 || memory >= 8 ? 50 : 40
    const frameInterval = 1000 / targetFps

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(width, height))
    }

    let animationFrameId: number | null = null

    const animate = () => {
      if (!ctx) {
        return
      }
      const now = performance.now()
      const deltaMs = now - lastFrameTime
      if (deltaMs < frameInterval) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }
      const delta = Math.min(2, Math.max(0.5, deltaMs / 16.67))
      lastFrameTime = now

      ctx.clearRect(0, 0, width, height)
      grid.forEach((cell) => {
        cell.length = 0
      })

      // Constellation connections (baby blue)
      ctx.strokeStyle = 'rgba(79, 172, 254, 0.2)' // Baby blue connections
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse.current, delta)
        particles[i].draw(ctx)

        const cellX = Math.floor(particles[i].x / cellSize)
        const cellY = Math.floor(particles[i].y / cellSize)
        const cellIndex = cellY * cols + cellX
        if (grid[cellIndex]) {
          grid[cellIndex].push(i)
        }
      }

      // Connect nearby particles using spatial grid
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]
        const cellX = Math.floor(particle.x / cellSize)
        const cellY = Math.floor(particle.y / cellSize)

        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          const neighborY = cellY + offsetY
          if (neighborY < 0 || neighborY >= rows) continue
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            const neighborX = cellX + offsetX
            if (neighborX < 0 || neighborX >= cols) continue
            const neighborIndex = neighborY * cols + neighborX
            const bucket = grid[neighborIndex]
            if (!bucket) continue

            for (const j of bucket) {
              if (j <= i) continue
              const neighbor = particles[j]
              const dx = particle.x - neighbor.x
              const dy = particle.y - neighbor.y
              const distanceSq = dx * dx + dy * dy
              if (distanceSq < maxDistanceSq) {
                ctx.beginPath()
                ctx.moveTo(particle.x, particle.y)
                ctx.lineTo(neighbor.x, neighbor.y)
                ctx.stroke()
              }
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    const start = () => {
      if (animationFrameId != null) {
        return
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    const stop = () => {
      if (animationFrameId == null) {
        return
      }
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }

    const setPaused = (value: boolean) => {
      if (value) {
        stop()
      } else {
        start()
      }
    }

    pauseControlRef.current = setPaused
    setPaused(pausedRef.current || document.hidden)

    // Visibility API - pause when tab hidden (saves CPU)
    const handleVisibilityChange = () => {
      setPaused(document.hidden || pausedRef.current)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      particles.length = 0
      const newCount = Math.min(300, Math.floor((width * height) / 12000))
      for (let i = 0; i < newCount; i++) {
        particles.push(new Particle(width, height))
      }
      cols = Math.ceil(width / cellSize)
      rows = Math.ceil(height / cellSize)
      grid = Array.from({ length: cols * rows }, () => [])
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (pausedRef.current || document.hidden) {
        return
      }
      mouse.current.x = e.x
      mouse.current.y = e.y
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (animationFrameId != null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}
    />
  )
}
