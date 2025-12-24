import { Suspense, lazy, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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

  // Track scroll progress for background transitions
  const { scrollYProgress } = useScroll()

  // Fade out galaxy background as user scrolls (0 = visible, 1 = invisible)
  const galaxyOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  // Transition overlay from transparent to light glass (dark → light)
  const overlayOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 0.85])

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
              <GalaxyBackground />
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
        <section id="hero" className="relative">
          <Hero />
        </section>

        {/* About Section - Dark transition */}
        <section id="about" className="relative z-10 bg-gradient-to-b from-space-black/95 via-charcoal/90 to-charcoal/70">
          <About />
          <CommandCenter />
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
