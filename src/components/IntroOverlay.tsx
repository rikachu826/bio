import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

type IntroOverlayProps = {
  onComplete: () => void
}

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [isClosing, setIsClosing] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const tiltXSpring = useSpring(tiltX, { stiffness: 90, damping: 20 })
  const tiltYSpring = useSpring(tiltY, { stiffness: 90, damping: 20 })
  const sheenX = useTransform(tiltYSpring, [-10, 10], [-36, 36])
  const sheenY = useTransform(tiltXSpring, [-8, 8], [-26, 26])
  const prefersReducedMotion = useReducedMotion()
  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(40)
  const nebulaX = useMotionTemplate`${mouseX}%`
  const nebulaY = useMotionTemplate`${mouseY}%`

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalBodyOverflow
    }
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const scheduleTiltUpdate = () => {
    if (rafRef.current || !lastPosRef.current) {
      return
    }
    rafRef.current = requestAnimationFrame(() => {
      const rect = overlayRef.current?.getBoundingClientRect()
      if (!rect || !lastPosRef.current) {
        rafRef.current = null
        return
      }
      const x = lastPosRef.current.x
      const y = lastPosRef.current.y
      tiltX.set(-y * 7)
      tiltY.set(x * 9)
      mouseX.set(Math.max(25, Math.min(75, 50 + x * 50)))
      mouseY.set(Math.max(25, Math.min(75, 40 + y * 40)))
      rafRef.current = null
    })
  }

  const handleEnter = () => {
    if (isClosing) {
      return
    }
    localStorage.setItem('introSeen', 'true')
    setIsClosing(true)
    window.setTimeout(() => {
      onComplete()
    }, 1200)
  }

  return (
    <motion.div
      className="intro-overlay"
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(event) => {
        if (prefersReducedMotion) {
          return
        }
        const rect = overlayRef.current?.getBoundingClientRect()
        if (!rect) {
          return
        }
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        lastPosRef.current = { x, y }
        scheduleTiltUpdate()
      }}
      onMouseLeave={() => {
        tiltX.set(0)
        tiltY.set(0)
        mouseX.set(50)
        mouseY.set(40)
        lastPosRef.current = null
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      }}
      style={{ '--nebula-x': nebulaX, '--nebula-y': nebulaY } as CSSProperties}
    >
      <div className="intro-stars" />
      <div className="intro-nebula" />
      <div className="intro-waves" />
      <div className="intro-glow" />

      <motion.div
        className="intro-panel"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? 12 : 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          rotateX: tiltXSpring,
          rotateY: tiltYSpring,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div className="intro-sheen" style={{ x: sheenX, y: sheenY }} />
        <p className="intro-eyebrow">AI HUMAN INTERFACE</p>
        <h1 className="intro-title">Human AI</h1>
        <p className="intro-subtitle">
          A nebula-born systems operator shaping security, cloud, and AI at scale.
        </p>
        <motion.button
          type="button"
          onClick={handleEnter}
          className="intro-button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Meet Leo
        </motion.button>
      </motion.div>

      <motion.div
        className="intro-curtain intro-curtain-drop"
        initial={{ y: '-120%' }}
        animate={{ y: isClosing ? '120%' : '-120%' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  )
}
