import { useRef, useEffect } from 'react'

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

  update(mouse: { x: number | null, y: number | null }) {
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
        const directionX = forceDirectionX * force * this.density
        const directionY = forceDirectionY * force * this.density
        this.x -= directionX
        this.y -= directionY
      } else {
        // Return to base drift
        if (this.x !== this.baseX) {
          const dx = this.x - this.baseX
          this.x -= dx / 10
        }
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY
          this.y -= dy / 10
        }
      }
    }

    // Base movement
    this.baseX += this.vx
    this.baseY += this.vy

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

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef<{ x: number | null, y: number | null }>({ x: null, y: null })

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
    const particleCount = Math.floor((width * height) / 9000) // Dense starfield

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(width, height))
    }

    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Constellation connections (baby blue)
      ctx.strokeStyle = 'rgba(79, 172, 254, 0.2)' // Baby blue connections
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse.current)
        particles[i].draw(ctx)

        // Connect nearby particles
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Visibility API - pause when tab hidden (saves CPU)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId)
      } else {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      particles.length = 0
      const newCount = Math.floor((width * height) / 9000)
      for (let i = 0; i < newCount; i++) {
        particles.push(new Particle(width, height))
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.x
      mouse.current.y = e.y
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationFrameId)
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
