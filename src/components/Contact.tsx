import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { generateResumePdf } from '../utils/resumePdf'
import content from '../content/site.json'
import { appleEase, sectionTitle, defaultViewport } from '../utils/animations'

// Holographic animation variants
const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
}

const blurbVariant = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(12px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: appleEase,
      delay: 0.1,
    },
  },
}

const contactCardVariant = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.88,
    filter: 'blur(18px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: appleEase,
    },
  },
}

const buttonVariant = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
    filter: 'blur(15px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: appleEase,
      delay: 0.2,
    },
  },
}

const footerVariant = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: appleEase,
      delay: 0.3,
    },
  },
}

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, defaultViewport)
  const [isGenerating, setIsGenerating] = useState(false)

  const contact = content.contact
  const contactMethods = contact.methods as {
    type: string
    label: string
    value: string
    link: string
  }[]

  const renderMethodIcon = (type: string) => {
    if (type === 'email') {
      return (
        <span className="envelope-icon" aria-hidden="true">
          <span className="envelope-letter" />
          <svg className="envelope-svg" viewBox="0 0 64 48" role="presentation">
            <rect className="envelope-back" x="4" y="10" width="56" height="30" rx="4" />
            <path className="envelope-front" d="M4 12L32 30L60 12V40H4Z" />
            <path className="envelope-flap" d="M4 12L32 30L60 12L32 6Z" />
          </svg>
        </span>
      )
    }
    return (
      <span className="envelope-icon" aria-hidden="true">
        <span className="envelope-letter" />
        <svg className="envelope-svg" viewBox="0 0 64 48" role="presentation">
          <rect className="envelope-back" x="4" y="10" width="56" height="30" rx="4" />
          <path className="envelope-front" d="M4 12L32 30L60 12V40H4Z" />
          <path className="envelope-flap" d="M4 12L32 30L60 12L32 6Z" />
        </svg>
      </span>
    )
  }

  return (
    <div id="contact" className="ocean-section" ref={ref}>
      {/* Ocean effect layers */}
      <div className="ocean-caustics" />
      <div className="ocean-bubbles" />

      {/* Sea life - plants and creatures */}
      <div className="ocean-sealife">
        {/* Seaweed/kelp plants at bottom */}
        <div className="ocean-plants">
          <svg className="kelp kelp--1" viewBox="0 0 40 200" preserveAspectRatio="none">
            <path d="M20,200 Q10,150 20,120 Q30,90 20,60 Q10,30 20,0" fill="none" stroke="rgba(34,197,94,0.6)" strokeWidth="8" strokeLinecap="round"/>
            <path d="M20,200 Q15,160 25,130 Q15,100 25,70 Q15,40 20,10" fill="none" stroke="rgba(74,222,128,0.5)" strokeWidth="5" strokeLinecap="round"/>
          </svg>
          <svg className="kelp kelp--2" viewBox="0 0 40 180" preserveAspectRatio="none">
            <path d="M20,180 Q30,140 20,100 Q10,60 20,20" fill="none" stroke="rgba(22,163,74,0.55)" strokeWidth="7" strokeLinecap="round"/>
            <path d="M20,180 Q25,150 15,110 Q25,70 15,30" fill="none" stroke="rgba(74,222,128,0.45)" strokeWidth="4" strokeLinecap="round"/>
          </svg>
          <svg className="kelp kelp--3" viewBox="0 0 40 220" preserveAspectRatio="none">
            <path d="M20,220 Q5,170 20,130 Q35,90 20,50 Q5,20 20,0" fill="none" stroke="rgba(34,197,94,0.5)" strokeWidth="9" strokeLinecap="round"/>
          </svg>
          <svg className="kelp kelp--4" viewBox="0 0 40 160" preserveAspectRatio="none">
            <path d="M20,160 Q28,120 12,80 Q28,40 20,10" fill="none" stroke="rgba(22,163,74,0.6)" strokeWidth="6" strokeLinecap="round"/>
          </svg>
          <svg className="kelp kelp--5" viewBox="0 0 40 190" preserveAspectRatio="none">
            <path d="M20,190 Q10,150 25,110 Q10,70 25,30" fill="none" stroke="rgba(74,222,128,0.55)" strokeWidth="7" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Coral reef at bottom */}
        <div className="ocean-reef">
          <svg className="coral coral--1" viewBox="0 0 120 140" aria-hidden="true">
            <path d="M20,140 Q30,90 20,40 Q18,20 30,10 Q40,0 50,18 Q55,30 50,45 Q45,65 50,90 Q52,115 45,140" fill="rgba(251,146,60,0.7)"/>
            <circle cx="80" cy="40" r="12" fill="rgba(248,113,113,0.6)"/>
            <circle cx="90" cy="70" r="8" fill="rgba(253,186,116,0.7)"/>
            <circle cx="70" cy="85" r="10" fill="rgba(249,115,22,0.6)"/>
          </svg>
          <svg className="coral coral--2" viewBox="0 0 120 120" aria-hidden="true">
            <path d="M25,120 Q30,90 25,60 Q22,40 35,25 Q45,10 60,20 Q70,30 65,50 Q60,70 68,90 Q72,110 65,120" fill="rgba(34,211,238,0.6)"/>
            <path d="M80,120 Q78,95 85,70 Q92,50 105,40 Q112,35 110,55 Q108,75 100,95 Q95,110 90,120" fill="rgba(56,189,248,0.55)"/>
          </svg>
          <svg className="coral coral--3" viewBox="0 0 120 150" aria-hidden="true">
            <path d="M30,150 Q35,115 25,90 Q18,70 28,55 Q38,40 45,55 Q50,65 45,85 Q40,105 50,125 Q55,140 50,150" fill="rgba(192,132,252,0.6)"/>
            <path d="M75,150 Q78,120 70,95 Q62,70 72,55 Q82,40 90,55 Q96,70 90,95 Q85,120 90,150" fill="rgba(216,180,254,0.55)"/>
            <circle cx="95" cy="40" r="10" fill="rgba(244,114,182,0.6)"/>
          </svg>
          <svg className="coral coral--4" viewBox="0 0 120 130" aria-hidden="true">
            <path d="M20,130 Q25,100 20,75 Q18,55 30,45 Q40,35 50,45 Q60,55 55,80 Q50,105 55,130" fill="rgba(14,165,233,0.55)"/>
            <circle cx="80" cy="55" r="14" fill="rgba(45,212,191,0.5)"/>
            <circle cx="95" cy="80" r="10" fill="rgba(34,197,94,0.5)"/>
          </svg>
          <svg className="coral coral--5" viewBox="0 0 120 110" aria-hidden="true">
            <path d="M30,110 Q35,85 28,65 Q22,45 35,35 Q50,25 60,40 Q70,55 65,75 Q60,95 65,110" fill="rgba(248,113,113,0.65)"/>
            <path d="M80,110 Q78,88 88,70 Q98,52 110,45 Q118,42 115,60 Q112,78 100,95 Q92,105 88,110" fill="rgba(250,204,21,0.6)"/>
          </svg>
          <svg className="reef-accent starfish starfish--1" viewBox="0 0 80 80" aria-hidden="true">
            <path d="M40,6 L48,28 L72,28 L52,42 L60,66 L40,52 L20,66 L28,42 L8,28 L32,28 Z" fill="rgba(251,146,60,0.85)"/>
            <circle cx="40" cy="40" r="6" fill="rgba(253,186,116,0.9)"/>
          </svg>
          <svg className="reef-accent starfish starfish--2" viewBox="0 0 80 80" aria-hidden="true">
            <path d="M40,8 L50,30 L74,32 L54,44 L62,68 L40,54 L18,68 L26,44 L6,32 L30,30 Z" fill="rgba(248,113,113,0.8)"/>
            <circle cx="40" cy="40" r="6" fill="rgba(252,165,165,0.9)"/>
          </svg>
          <svg className="reef-accent shell shell--1" viewBox="0 0 90 60" aria-hidden="true">
            <path d="M10,50 Q45,10 80,50 Z" fill="rgba(226,232,240,0.7)"/>
            <path d="M20,48 Q45,20 70,48" fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="3"/>
            <path d="M30,48 Q45,26 60,48" fill="none" stroke="rgba(148,163,184,0.55)" strokeWidth="2"/>
          </svg>
          <svg className="reef-accent shell shell--2" viewBox="0 0 90 60" aria-hidden="true">
            <path d="M12,48 Q45,12 78,48 Z" fill="rgba(244,244,245,0.65)"/>
            <path d="M22,46 Q45,22 68,46" fill="none" stroke="rgba(148,163,184,0.55)" strokeWidth="3"/>
            <path d="M34,46 Q45,28 56,46" fill="none" stroke="rgba(148,163,184,0.5)" strokeWidth="2"/>
          </svg>
        </div>

        {/* Swimming fish */}
        <svg className="fish fish--1" viewBox="0 0 50 30">
          <ellipse cx="20" cy="15" rx="15" ry="10" fill="rgba(251,146,60,0.8)"/>
          <polygon points="35,15 50,5 50,25" fill="rgba(251,146,60,0.8)"/>
          <circle cx="12" cy="13" r="2" fill="rgba(30,30,30,0.9)"/>
          <path d="M5,12 Q8,15 5,18" fill="none" stroke="rgba(253,186,116,0.9)" strokeWidth="2"/>
        </svg>

        <svg className="fish fish--2" viewBox="0 0 50 30">
          <ellipse cx="20" cy="15" rx="15" ry="10" fill="rgba(56,189,248,0.75)"/>
          <polygon points="35,15 50,5 50,25" fill="rgba(56,189,248,0.75)"/>
          <circle cx="12" cy="13" r="2" fill="rgba(30,30,30,0.9)"/>
          <ellipse cx="20" cy="15" rx="10" ry="5" fill="rgba(125,211,252,0.5)"/>
        </svg>

        <svg className="fish fish--3" viewBox="0 0 50 30">
          <ellipse cx="20" cy="15" rx="15" ry="10" fill="rgba(251,207,232,0.8)"/>
          <polygon points="35,15 50,5 50,25" fill="rgba(251,207,232,0.8)"/>
          <circle cx="12" cy="13" r="2" fill="rgba(30,30,30,0.9)"/>
          <path d="M15,10 Q20,5 25,10" fill="none" stroke="rgba(244,114,182,0.7)" strokeWidth="1.5"/>
        </svg>

        <svg className="fish fish--4" viewBox="0 0 50 30">
          <ellipse cx="20" cy="15" rx="15" ry="10" fill="rgba(134,239,172,0.75)"/>
          <polygon points="35,15 50,5 50,25" fill="rgba(134,239,172,0.75)"/>
          <circle cx="12" cy="13" r="2" fill="rgba(30,30,30,0.9)"/>
        </svg>

        {/* Sea turtle */}
        <svg className="turtle" viewBox="0 0 80 50">
          <ellipse cx="40" cy="28" rx="25" ry="18" fill="rgba(34,197,94,0.7)"/>
          <ellipse cx="40" cy="28" rx="20" ry="14" fill="rgba(74,222,128,0.5)"/>
          <path d="M35,28 L30,28 L28,32 L32,30 Z" fill="rgba(34,197,94,0.6)"/>
          <circle cx="65" cy="25" r="8" fill="rgba(34,197,94,0.7)"/>
          <circle cx="68" cy="23" r="2" fill="rgba(30,30,30,0.8)"/>
          <ellipse cx="18" cy="20" rx="8" ry="5" fill="rgba(34,197,94,0.6)" transform="rotate(-30 18 20)"/>
          <ellipse cx="18" cy="36" rx="8" ry="5" fill="rgba(34,197,94,0.6)" transform="rotate(30 18 36)"/>
          <ellipse cx="58" cy="18" rx="6" ry="4" fill="rgba(34,197,94,0.6)" transform="rotate(-20 58 18)"/>
          <ellipse cx="58" cy="38" rx="6" ry="4" fill="rgba(34,197,94,0.6)" transform="rotate(20 58 38)"/>
        </svg>

        {/* Stingray */}
        <svg className="ray" viewBox="0 0 120 70" aria-hidden="true">
          <path d="M10,35 Q35,10 60,25 Q85,10 110,35 Q85,55 60,45 Q35,55 10,35 Z" fill="rgba(125,211,252,0.55)"/>
          <circle cx="50" cy="32" r="2.5" fill="rgba(30,30,30,0.8)"/>
          <circle cx="70" cy="32" r="2.5" fill="rgba(30,30,30,0.8)"/>
          <path d="M60,45 Q62,55 70,65" fill="none" stroke="rgba(125,211,252,0.55)" strokeWidth="3" strokeLinecap="round"/>
        </svg>

        {/* Jellyfish */}
        <svg className="jellyfish" viewBox="0 0 60 80">
          <ellipse cx="30" cy="20" rx="25" ry="18" fill="rgba(192,132,252,0.5)"/>
          <ellipse cx="30" cy="20" rx="20" ry="14" fill="rgba(216,180,254,0.4)"/>
          <path d="M10,25 Q15,50 8,80" fill="none" stroke="rgba(192,132,252,0.6)" strokeWidth="2"/>
          <path d="M20,28 Q22,55 18,80" fill="none" stroke="rgba(216,180,254,0.5)" strokeWidth="2"/>
          <path d="M30,30 Q30,55 30,80" fill="none" stroke="rgba(192,132,252,0.5)" strokeWidth="2"/>
          <path d="M40,28 Q38,55 42,80" fill="none" stroke="rgba(216,180,254,0.5)" strokeWidth="2"/>
          <path d="M50,25 Q45,50 52,80" fill="none" stroke="rgba(192,132,252,0.6)" strokeWidth="2"/>
        </svg>
      </div>

      {/* Waves at bottom */}
      <div className="ocean-waves">
        <div className="ocean-wave ocean-wave--back" />
        <div className="ocean-wave ocean-wave--mid" />
        <div className="ocean-wave ocean-wave--front" />
      </div>

      {/* Content wrapper - above all effects */}
      <div className="ocean-content section-container py-20">
        <div className="content-wrapper max-w-4xl">
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.h2
            className="text-section-title font-display mb-6"
            variants={sectionTitle}
          >
            {contact.title.leading} <span className="gradient-text">{contact.title.accent}</span>
          </motion.h2>

          <motion.p
            className="text-xl text-light-gray mb-12 max-w-2xl mx-auto"
            variants={blurbVariant}
          >
            {contact.blurb}
          </motion.p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-12"
          variants={containerVariant}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={contactCardVariant}
              className="glass p-6 rounded-2xl border border-white/30 bg-gradient-to-br from-space-black/70 via-slate-900/60 to-charcoal/70
                         hover:border-sky-blue/40
                         transition-all duration-300 group"
              whileHover={{
                scale: 1.08,
                y: -12,
                boxShadow: '0 35px 70px rgba(56, 189, 248, 0.2), 0 0 50px rgba(56, 189, 248, 0.12)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center gap-4">
                <div className="contact-icon group-hover:scale-110 transition-transform duration-300">
                  {renderMethodIcon(method.type)}
                </div>
                <div className="text-left">
                  <div className="text-sm text-soft-gray mb-1 group-hover:gradient-text transition-all">
                    {method.label}
                  </div>
                  <div className="text-pure-white group-hover:gradient-text transition-all">
                    {method.value}
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          variants={buttonVariant}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.button
            type="button"
            onClick={async () => {
              setIsGenerating(true)
              try {
                await generateResumePdf()
              } finally {
                setIsGenerating(false)
              }
            }}
            className="inline-block px-8 py-4 bg-gradient-blue rounded-full text-pure-white font-semibold
                     shadow-lg shadow-ocean-blue/20 hover:shadow-xl hover:shadow-ocean-blue/30
                     transition-all duration-300 ease-apple mb-8 disabled:opacity-70"
            disabled={isGenerating}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? 'Generating PDF...' : contact.resumeButton}
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.footer
          variants={footerVariant}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <motion.a
                  href="#top"
                  aria-label="Back to top"
                  className="glass h-11 w-11 rounded-full flex items-center justify-center text-lg text-pure-white
                           border border-sky-blue/30 shadow-[0_0_16px_rgba(79,172,254,0.25)]
                           animate-pulse-soft transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ↑
                </motion.a>
                <span className="text-[0.7rem] text-soft-gray">Top</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <motion.a
                  href={contact.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub repository"
                  className="glass h-11 w-11 rounded-full flex items-center justify-center text-pure-white
                           border border-sky-blue/30 shadow-[0_0_16px_rgba(79,172,254,0.25)]
                           transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.02c0 4.424 2.865 8.19 6.839 9.517.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.467-1.11-1.467-.908-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.53 2.341 1.088 2.91.832.09-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.104-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.6 9.6 0 0 1 2.504.337c1.909-1.296 2.748-1.026 2.748-1.026.546 1.378.204 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.944.36.309.68.92.68 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.02C22 6.484 17.523 2 12 2Z" />
                  </svg>
                </motion.a>
                <span className="text-[0.7rem] text-soft-gray">GitHub</span>
              </div>
            </div>
            <p className="text-soft-gray text-sm">
              {contact.footerCopyright}
            </p>
          </div>
        </motion.footer>
        </div>
      </div>
    </div>
  )
}
