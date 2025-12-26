import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import content from '../content/site.json'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px", amount: 0.15 })
  const about = content.about

  return (
    <div className="section-container" ref={ref}>
      <div className="content-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-section-title font-display mb-8">
            {about.title.leading} <span className="gradient-text">{about.title.accent}</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {about.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-lg text-light-gray mb-6 leading-relaxed">
                  {paragraph.label ? (
                    <>
                      <strong className="text-pure-white">{paragraph.label}</strong>{' '}
                      {paragraph.text}
                    </>
                  ) : (
                    paragraph.text
                  )}
                </p>
              ))}
              <div className="flex gap-4 flex-wrap">
                {about.pills.map((pill) => (
                  <span key={pill} className="px-4 py-2 glass rounded-full text-sm">
                    {pill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-8 rounded-3xl"
            >
              <h3 className="text-2xl font-semibold mb-6 gradient-text">{about.journeyTitle}</h3>
              <div className="space-y-4">
                {about.journey.map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex justify-between items-center ${index < about.journey.length - 1 ? 'border-b border-white/10 pb-3' : ''}`}
                  >
                    <span className="text-soft-gray">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
