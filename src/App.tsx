import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Hero from './components/Hero'
import About from './components/About'
import CommandCenter from './components/CommandCenter'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import AIAssistant from './components/AIAssistant'
import Contact from './components/Contact'
import IntroOverlay from './components/IntroOverlay'

// Lazy load galaxy background for better performance
const GalaxyBackground = lazy(() => import('./components/Scene/GalaxyBackground'))

function App() {
  const [introComplete, setIntroComplete] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return localStorage.getItem('introSeen') === 'true'
  })
  const [isIdle, setIsIdle] = useState(false)
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const heroRef = useRef<HTMLElement | null>(null)
  const idleRef = useRef(false)

  const galaxyOpacity = 1
  const overlayOpacity = 0.75
  const shouldPauseGalaxy = isIdle || !isHeroVisible

  useEffect(() => {
    if (!introComplete) {
      return
    }
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
  }, [introComplete])

  useEffect(() => {
    if (!heroRef.current || !introComplete) {
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
  }, [introComplete])

  return (
    <div className="relative">
      {!introComplete && <IntroOverlay onComplete={() => setIntroComplete(true)} />}

      <motion.div
        className="relative"
        initial={false}
        animate={
          introComplete
            ? { opacity: 1, filter: 'blur(0px)', scale: 1 }
            : { opacity: 0.45, filter: 'blur(16px)', scale: 0.98 }
        }
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: introComplete ? 0.35 : 0 }}
      >
        {introComplete && (
          <Suspense fallback={<div className="h-screen bg-space-black" />}>
            <motion.div
              className="fixed inset-0 -z-20"
              style={{ opacity: galaxyOpacity }}
            >
              <GalaxyBackground paused={shouldPauseGalaxy} />
            </motion.div>
          </Suspense>
        )}

        {introComplete && (
          <motion.div
            className="fixed inset-0 -z-10 bg-gradient-to-b from-white/5 via-baby-blue/10 to-sky-blue/20"
            style={{ opacity: overlayOpacity }}
          />
        )}

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

        {/* Skills Section - Lighter */}
        <section id="skills" className="relative z-10 bg-gradient-to-b from-white/10 via-baby-blue/15 to-sky-blue/20">
          <Skills />
        </section>

        {/* Contact Section - Lightest (glass) */}
        <section id="contact" className="relative z-10 bg-gradient-to-b from-sky-blue/20 to-baby-blue/30">
          <Contact />
        </section>

      </motion.div>

      <AIAssistant />
    </div>
  )
}

export default App
