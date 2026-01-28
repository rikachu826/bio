import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import CommandCenter from './components/CommandCenter'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import AIAssistant from './components/AIAssistant'
import Contact from './components/Contact'

// Lazy load galaxy background for better performance
const GalaxyBackground = lazy(() => import('./components/Scene/GalaxyBackground'))

function App() {
  const [isIdle, setIsIdle] = useState(false)
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const heroRef = useRef<HTMLElement | null>(null)
  const idleRef = useRef(false)

  const shouldPauseGalaxy = isIdle || !isHeroVisible

  // Idle detection — pause galaxy after 10 minutes of inactivity
  useEffect(() => {
    const idleTimeoutMs = 10 * 60 * 1000
    let idleTimer: number | undefined

    const markIdle = () => {
      idleRef.current = true
      setIsIdle(true)
    }

    const resetIdleTimer = () => {
      if (idleRef.current) {
        idleRef.current = false
        setIsIdle(false)
      }
      if (idleTimer) {
        window.clearTimeout(idleTimer)
      }
      idleTimer = window.setTimeout(markIdle, idleTimeoutMs)
    }

    const events: Array<keyof WindowEventMap> = ['mousemove', 'keydown', 'scroll', 'touchstart', 'pointerdown']
    events.forEach((event) => window.addEventListener(event, resetIdleTimer, { passive: true }))
    resetIdleTimer()

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer))
      if (idleTimer) {
        window.clearTimeout(idleTimer)
      }
    }
  }, [])

  // Pause galaxy when hero section scrolls out of view
  useEffect(() => {
    if (!heroRef.current) {
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )
    observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative">
      <Suspense fallback={<div className="h-screen bg-space-black" />}>
        <div
          className="fixed inset-0 -z-20"
          style={{ opacity: 1 }}
        >
          <GalaxyBackground paused={shouldPauseGalaxy} />
        </div>
      </Suspense>

      <div
        className="fixed inset-0 -z-10 bg-gradient-to-b from-white/5 via-baby-blue/10 to-sky-blue/20"
        style={{ opacity: 0.75 }}
      />

      {/* Hero Section with Galaxy Background */}
      <section id="hero" className="relative" ref={heroRef}>
        <Hero />
      </section>

      {/* About Section - Dark transition */}
      <section id="about" className="relative z-10 bg-gradient-to-b from-space-black/95 via-charcoal/90 to-charcoal/70">
        <About />
        <CommandCenter paused={isIdle} />
      </section>

      {/* Experience Section - Medium transition */}
      <section id="experience" className="relative z-10 bg-gradient-to-b from-charcoal/70 via-charcoal/55 to-charcoal/40">
        <Experience />
      </section>

      {/* Projects Section - Light transition */}
      <section id="projects" className="relative z-10 bg-gradient-to-b from-charcoal/40 via-white/5 to-white/10">
        <Projects />
      </section>

      {/* Skills Section - Transitions into ocean depths */}
      <section id="skills" className="relative z-10 bg-gradient-to-b from-white/10 via-baby-blue/15 to-space-black/95">
        <Skills />
      </section>

      {/* Contact Section - Immersive Ocean Zone */}
      <section id="contact" className="relative z-10">
        <Contact />
      </section>

      <AIAssistant />
    </div>
  )
}

export default App
