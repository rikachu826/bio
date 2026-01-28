import { motion } from 'framer-motion'
import content from '../content/site.json'
import { appleEase, cyberBounce } from '../utils/animations'

// Holographic container - staggers all children
const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

// Dramatic name reveal - materializes from bright blur (keep filter for this one-time hero reveal)
const heroName = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.8,
    filter: 'blur(40px) brightness(2.5)',
    textShadow: '0 0 80px rgba(56, 189, 248, 0.9)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
    textShadow: '0 0 50px rgba(56, 189, 248, 0.5)',
    transition: {
      duration: 1.4,
      ease: appleEase,
    },
  },
}

// Subtitle scans in with letter spacing compression
const heroSubtitle = {
  hidden: {
    opacity: 0,
    y: 50,
    letterSpacing: '0.4em',
  },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: '0em',
    transition: {
      duration: 1.1,
      ease: appleEase,
    },
  },
}

// Summary text fades in
const heroSummary = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: appleEase,
    },
  },
}

// CTA buttons materialize
const heroCTA = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: cyberBounce,
    },
  },
}

// Individual button stagger
const buttonVariant = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: appleEase,
    },
  },
}

export default function Hero() {
  const hero = content.hero

  return (
    <div id="top" className="section-container min-h-screen">
      <div className="content-wrapper text-center">
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Name - Dramatic holographic reveal */}
          <motion.h1
            className="text-hero font-display mb-8"
            variants={heroName}
          >
            <span className="gradient-text holo-text">{hero.name}</span>
          </motion.h1>

          {/* Subtitle - Scans in with compression */}
          <motion.h2
            className="text-3xl md:text-4xl font-light mb-10 text-soft-gray"
            variants={heroSubtitle}
          >
            {hero.role} <span className="text-sky-blue/60">•</span> <span className="text-pure-white">{hero.org}</span>
          </motion.h2>

          {/* Summary - Soft fade with blur */}
          <motion.p
            className="text-xl md:text-2xl text-light-gray max-w-3xl mx-auto mb-14 leading-relaxed"
            variants={heroSummary}
          >
            {hero.summaryParts.map((part, index) =>
              part.type === 'link' ? (
                <a
                  key={`${part.text}-${index}`}
                  href={part.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-blue hover:text-baby-blue underline underline-offset-4 transition-colors"
                >
                  {part.text}
                </a>
              ) : (
                <span key={`text-${index}`}>{part.value}</span>
              )
            )}
          </motion.p>

          {/* CTA Buttons - Bounce in with glow */}
          <motion.div
            className="flex gap-8 justify-center flex-wrap"
            variants={heroCTA}
          >
            <motion.a
              href={hero.cta.primary.href}
              className="px-10 py-5 bg-gradient-blue rounded-full text-pure-white font-semibold text-lg
                       shadow-lg shadow-ocean-blue/30 holo-glow
                       transition-all duration-400 ease-apple"
              variants={buttonVariant}
              whileHover={{
                scale: 1.08,
                y: -8,
                boxShadow: '0 0 50px rgba(56, 189, 248, 0.4), 0 30px 60px rgba(0, 0, 0, 0.3)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              {hero.cta.primary.label}
            </motion.a>
            <motion.a
              href={hero.cta.secondary.href}
              className="px-10 py-5 glass rounded-full text-pure-white font-semibold text-lg
                       border border-sky-blue/30
                       transition-all duration-400 ease-apple"
              variants={buttonVariant}
              whileHover={{
                scale: 1.08,
                y: -8,
                borderColor: 'rgba(56, 189, 248, 0.6)',
                boxShadow: '0 0 30px rgba(56, 189, 248, 0.2), 0 25px 50px rgba(0, 0, 0, 0.25)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              {hero.cta.secondary.label}
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - Holographic pulse */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: appleEase }}
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
              boxShadow: [
                '0 0 15px rgba(56, 189, 248, 0.2)',
                '0 0 25px rgba(56, 189, 248, 0.4)',
                '0 0 15px rgba(56, 189, 248, 0.2)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-7 h-12 border-2 border-sky-blue/40 rounded-full flex items-start justify-center p-2
                     bg-white/5 backdrop-blur-sm"
          >
            <motion.div
              className="w-1.5 h-3 bg-gradient-blue rounded-full"
              animate={{
                opacity: [0.4, 1, 0.4],
                y: [0, 8, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
