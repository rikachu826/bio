/**
 * Cyberpunk Holographic Animation System
 *
 * Design principles:
 * - Holographic projection feel with blur and glow
 * - Panels materialize like they're being rendered in real-time
 * - Text scans in like data streaming
 * - Floating, weightless feel throughout
 * - Minority Report operator console aesthetic
 */

import { Variants, Transition } from 'framer-motion'

// ============================================
// CORE EASING & TIMING
// ============================================

// Smooth cyber deceleration - floaty, holographic feel
export const appleEase = [0.16, 1, 0.3, 1] as const

// Bouncy for emphasis moments
export const cyberBounce = [0.34, 1.56, 0.64, 1] as const

// Snappy for UI responses
export const cyberSnap = [0.23, 1, 0.32, 1] as const

// Standard transition settings
export const standardTransition: Transition = {
  duration: 0.8,
  ease: appleEase,
}

// Quick for micro-interactions
export const quickTransition: Transition = {
  duration: 0.5,
  ease: cyberSnap,
}

// Slow for dramatic reveals
export const slowTransition: Transition = {
  duration: 1.2,
  ease: appleEase,
}

// ============================================
// HOLOGRAPHIC PROJECTION VARIANTS
// ============================================

// Main panel materialization - like being projected from thin air
export const holoMaterialize: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.85,
    filter: 'blur(20px) brightness(2)',
    rotateX: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
    rotateX: 0,
    transition: {
      duration: 1,
      ease: appleEase,
    },
  },
}

// Scan-line text reveal
export const holoTextReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(12px)',
    textShadow: '0 0 0px rgba(56, 189, 248, 0)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    textShadow: '0 0 30px rgba(56, 189, 248, 0.5)',
    transition: {
      duration: 0.9,
      ease: appleEase,
    },
  },
}

// Card floating in from the void
export const holoFloat: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.9,
    filter: 'blur(15px)',
    rotateY: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateY: 0,
    transition: {
      duration: 0.9,
      ease: appleEase,
    },
  },
}

// Glitch-in effect for emphasis
export const holoGlitch: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
    scale: 1.1,
    filter: 'blur(25px) hue-rotate(90deg)',
    skewX: 10,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px) hue-rotate(0deg)',
    skewX: 0,
    transition: {
      duration: 0.7,
      ease: cyberSnap,
    },
  },
}

// ============================================
// DIRECTIONAL SLIDE VARIANTS (Enhanced)
// ============================================

// Fade up with holographic glow
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.92,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: standardTransition,
  },
}

// Fade down from above
export const fadeDown: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: standardTransition,
  },
}

// Slide from left with rotation
export const slideFromLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
    scale: 0.9,
    filter: 'blur(12px)',
    rotateY: 15,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateY: 0,
    transition: standardTransition,
  },
}

// Slide from right with rotation
export const slideFromRight: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.9,
    filter: 'blur(12px)',
    rotateY: -15,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateY: 0,
    transition: standardTransition,
  },
}

// Scale up from center with glow
export const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    filter: 'blur(20px) brightness(1.5)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
    transition: {
      duration: 0.8,
      ease: cyberBounce,
    },
  },
}

// ============================================
// CONTAINER VARIANTS (Staggered Reveals)
// ============================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

// ============================================
// SPECIAL HOLOGRAPHIC EFFECTS
// ============================================

// Hero name - dramatic entrance
export const heroReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.8,
    filter: 'blur(30px) brightness(2)',
    textShadow: '0 0 60px rgba(56, 189, 248, 0.8)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
    textShadow: '0 0 40px rgba(56, 189, 248, 0.4)',
    transition: {
      duration: 1.2,
      ease: appleEase,
    },
  },
}

// Subtitle scanning in
export const subtitleScan: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    letterSpacing: '0.3em',
    filter: 'blur(15px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: '0em',
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      ease: appleEase,
    },
  },
}

// Glass panel reveal with depth
export const glassReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
    filter: 'blur(15px)',
    backdropFilter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    backdropFilter: 'blur(20px)',
    transition: {
      duration: 0.9,
      ease: appleEase,
    },
  },
}

// Card floating in 3D space
export const cardFloat: Variants = {
  hidden: {
    opacity: 0,
    y: 70,
    z: -100,
    scale: 0.85,
    filter: 'blur(12px)',
    rotateX: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    z: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateX: 0,
    transition: {
      duration: 0.85,
      ease: appleEase,
    },
  },
}

// Floating idle animation (for after entrance)
export const floatIdle = {
  y: [0, -8, 0],
  transition: {
    duration: 4,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'reverse' as const,
  },
}

// ============================================
// HOVER STATES (Enhanced)
// ============================================

export const hoverLift = {
  y: -8,
  scale: 1.03,
  filter: 'brightness(1.05)',
  boxShadow: '0 25px 50px rgba(56, 189, 248, 0.2)',
  transition: { duration: 0.35, ease: appleEase },
}

export const hoverGlow = {
  y: -10,
  scale: 1.04,
  boxShadow: '0 30px 60px rgba(56, 189, 248, 0.25), 0 0 40px rgba(56, 189, 248, 0.15)',
  transition: { duration: 0.35, ease: appleEase },
}

export const hoverFloat = {
  y: -12,
  scale: 1.02,
  rotateY: 5,
  boxShadow: '0 35px 70px rgba(56, 189, 248, 0.2)',
  transition: { duration: 0.4, ease: appleEase },
}

export const tapScale = {
  scale: 0.97,
}

// ============================================
// SECTION-SPECIFIC PRESETS
// ============================================

// Section title - scanning in with glow
export const sectionTitle: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    filter: 'blur(15px)',
    textShadow: '0 0 0px rgba(56, 189, 248, 0)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    textShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
    transition: {
      duration: 0.8,
      ease: appleEase,
    },
  },
}

// Intro paragraphs - softer fade
export const introParagraph: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: appleEase,
      delay: 0.15,
    },
  },
}

// List items with scan effect
export const listItem: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: quickTransition,
  },
}

// Grid items alternating
export const gridItem: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: standardTransition,
  },
}

// ============================================
// VIEWPORT SETTINGS
// ============================================

// Default: Balanced settings that work for most sections
// - amount: 0.1 = 10% of element must be visible (works for tall sections)
// - margin: -80px = element must be 80px inside viewport before triggering
// This prevents sections from animating on load while still working for tall content
export const defaultViewport = {
  once: true,
  margin: '0px 0px -80px 0px',
  amount: 0.1 as const,
}

// Eager: For smaller elements that should animate slightly sooner
export const eagerViewport = {
  once: true,
  margin: '0px 0px -30px 0px',
  amount: 0.05 as const,
}

// Lazy: For sections that should wait until more prominently in view
export const lazyViewport = {
  once: true,
  margin: '0px 0px -120px 0px',
  amount: 0.2 as const,
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Create staggered delay for items
export const getStaggerDelay = (index: number, base = 0.1) => ({
  ...standardTransition,
  delay: index * base,
})

// Create alternating left/right variants for lists
export const getAlternatingSlide = (index: number): Variants =>
  index % 2 === 0 ? slideFromLeft : slideFromRight

// Get directional variant based on position in grid
export const getGridDirection = (index: number, columns = 3) => {
  const col = index % columns
  if (col === 0) return slideFromLeft
  if (col === columns - 1) return slideFromRight
  return fadeUp
}
