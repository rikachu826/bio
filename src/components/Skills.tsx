import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import content from '../content/site.json'
import { appleEase, sectionTitle, defaultViewport } from '../utils/animations'

interface SkillCategory {
  category: string
  skills: string[]
}

const skillsSection = content.skillsSection
const skillCategories: SkillCategory[] = skillsSection.categories as SkillCategory[]

// Holographic stagger container
const categoryContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

// Category card - alternating directions
const getCategoryVariant = (index: number) => ({
  hidden: {
    opacity: 0,
    x: index % 3 === 0 ? -60 : index % 3 === 1 ? 0 : 60,
    y: index % 3 === 1 ? 60 : 30,
    scale: 0.88,
    rotateY: index % 3 === 0 ? 10 : index % 3 === 2 ? -10 : 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.9,
      ease: appleEase,
    },
  },
})

// Skill badge animation
const skillBadge = {
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
      duration: 0.4,
      ease: appleEase,
    },
  },
}

// Skill container stagger
const skillContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.15,
    },
  },
}

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, defaultViewport)

  return (
    <div id="skills" className="section-container py-20" ref={ref}>
      <div className="content-wrapper">
        <motion.h2
          className="text-section-title font-display mb-16 text-center"
          variants={sectionTitle}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skillsSection.title.leading}{' '}
          <span className="gradient-text">{skillsSection.title.accent}</span>
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={categoryContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={getCategoryVariant(index)}
              className="glass p-6 rounded-2xl bg-space-black/70 border border-white/20
                       hover:border-sky-blue/40
                       transition-all duration-400 group"
              whileHover={{
                y: -12,
                scale: 1.04,
                rotateY: 3,
                boxShadow: '0 30px 60px rgba(56, 189, 248, 0.2), 0 0 40px rgba(56, 189, 248, 0.12)',
                transition: { duration: 0.4 }
              }}
            >
              <motion.h3
                className="text-xl font-semibold mb-4 gradient-text drop-shadow-[0_0_18px_rgba(125,211,252,0.45)]"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1, ease: appleEase }}
              >
                {category.category}
              </motion.h3>

              <motion.div
                className="flex flex-wrap gap-2"
                variants={skillContainer}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {category.skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    variants={skillBadge}
                    className="px-3 py-1 bg-charcoal/70 rounded-full text-sm text-light-gray
                             border border-white/10 hover:border-sky-blue/50 hover:text-pure-white
                             hover:bg-charcoal/90 transition-all duration-200 cursor-default"
                    whileHover={{ scale: 1.08, y: -2 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
