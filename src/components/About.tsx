import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import content from '../content/site.json'
import {
  appleEase,
  sectionTitle,
  staggerContainer,
  defaultViewport,
} from '../utils/animations'

// Paragraph animation with stagger
const paragraphVariant = {
  hidden: {
    opacity: 0,
    y: 35,
    x: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration: 0.7,
      ease: appleEase,
    },
  },
}

// Pill animation
const pillVariant = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    y: 15,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: appleEase,
    },
  },
}

// Journey item animation
const journeyItemVariant = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: appleEase,
    },
  },
}

// Glass card with float effect
const glassCardVariant = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.9,
    rotateY: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 1,
      ease: appleEase,
      delay: 0.2,
    },
  },
}

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, defaultViewport)
  const about = content.about

  return (
    <div id="about" className="section-container" ref={ref}>
      <div className="content-wrapper">
        {/* Section Title */}
        <motion.h2
          className="text-section-title font-display mb-12"
          variants={sectionTitle}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {about.title.leading} <span className="gradient-text">{about.title.accent}</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Paragraphs */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {about.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                className="text-lg text-light-gray mb-6 leading-relaxed"
                variants={paragraphVariant}
                custom={index}
              >
                {paragraph.label ? (
                  <>
                    <strong className="text-pure-white">{paragraph.label}</strong>{' '}
                    {paragraph.text}
                  </>
                ) : (
                  paragraph.text
                )}
              </motion.p>
            ))}

            {/* Pills */}
            <motion.div
              className="flex gap-3 flex-wrap mt-8"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {about.pills.map((pill) => (
                <motion.span
                  key={pill}
                  className="px-4 py-2 glass rounded-full text-sm hover:bg-white/10
                           transition-colors duration-300 cursor-default"
                  variants={pillVariant}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {pill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Journey Card */}
          <motion.div
            className="glass p-8 rounded-3xl
                     transition-shadow duration-500"
            variants={glassCardVariant}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{
              y: -10,
              scale: 1.02,
              rotateY: 3,
              boxShadow: '0 30px 60px rgba(56, 189, 248, 0.15), 0 0 40px rgba(56, 189, 248, 0.1)',
              transition: { duration: 0.4 }
            }}
          >
            <motion.h3
              className="text-2xl font-semibold mb-6 gradient-text"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {about.journeyTitle}
            </motion.h3>

            <motion.div
              className="space-y-4"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.06,
                    delayChildren: 0.5,
                  },
                },
              }}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {about.journey.map((item, index) => (
                <motion.div
                  key={item.label}
                  className={`flex justify-between items-center ${
                    index < about.journey.length - 1 ? 'border-b border-white/10 pb-3' : ''
                  }`}
                  variants={journeyItemVariant}
                >
                  <span className="text-soft-gray">{item.label}</span>
                  <span className="font-semibold text-pure-white">{item.value}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
