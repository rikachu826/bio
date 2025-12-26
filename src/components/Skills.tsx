import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import content from '../content/site.json'

interface SkillCategory {
  category: string
  skills: string[]
}

const skillsSection = content.skillsSection
const skillCategories: SkillCategory[] = skillsSection.categories as SkillCategory[]

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px", amount: 0.15 })

  return (
    <div className="section-container py-20" ref={ref}>
      <div className="content-wrapper">
        <motion.h2
          className="text-section-title font-display mb-16 text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {skillsSection.title.leading}{' '}
          <span className="gradient-text">{skillsSection.title.accent}</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-6 rounded-2xl bg-space-black/70 border border-white/20 hover:border-sky-blue/40 hover:shadow-[0_0_24px_rgba(56,189,248,0.25)] transition-all duration-300 group"
            >
              <h3 className="text-xl font-semibold mb-4 gradient-text drop-shadow-[0_0_18px_rgba(125,211,252,0.45)]">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.4, delay: index * 0.06 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="px-3 py-1 bg-charcoal/70 rounded-full text-sm text-light-gray border border-white/10 hover:border-sky-blue/50 hover:text-pure-white transition-all cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
