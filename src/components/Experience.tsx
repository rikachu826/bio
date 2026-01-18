import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import content from '../content/site.json'
import { appleEase, sectionTitle, defaultViewport } from '../utils/animations'

// Holographic panel variants with blur and glow
const storyPanelVariant = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9,
    filter: 'blur(20px)',
    rotateX: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateX: 0,
    transition: { duration: 1, ease: appleEase },
  },
}

const legacyPanelVariant = {
  hidden: {
    opacity: 0,
    x: -80,
    scale: 0.92,
    filter: 'blur(15px)',
    rotateY: 10,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateY: 0,
    transition: { duration: 0.9, ease: appleEase, delay: 0.1 },
  },
}

const gridCardVariant = (fromLeft: boolean, delay: number) => ({
  hidden: {
    opacity: 0,
    x: fromLeft ? -60 : 60,
    scale: 0.9,
    filter: 'blur(12px)',
    rotateY: fromLeft ? 8 : -8,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateY: 0,
    transition: { duration: 0.8, ease: appleEase, delay },
  },
})

const centerPanelVariant = (delay: number) => ({
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.92,
    filter: 'blur(15px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: appleEase, delay },
  },
})

const teamBadgeVariant = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(20px) brightness(1.5)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px) brightness(1)',
    transition: { duration: 0.7, ease: appleEase, delay: 0.45 },
  },
}

const outcomeVariant = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9,
    filter: 'blur(18px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: appleEase, delay: 0.5 },
  },
}

const timelineContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.35 },
  },
}

const timelineItemVariant = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: appleEase },
  },
}

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, defaultViewport)
  const [forceVisible, setForceVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    if (window.innerWidth < 768) {
      setForceVisible(true)
    }
  }, [])

  const isVisible = isInView || forceVisible
  const experience = content.experience
  const story = experience.story
  const legacy = experience.legacy
  const grid = experience.grid
  const security = experience.security
  const luminos = experience.luminos
  const team = experience.team
  const outcome = experience.outcome
  const timeline = experience.timeline

  const renderHtml = (value: string) => ({ __html: value })

  return (
    <div id="experience" className="section-container py-20" ref={ref}>
      <div className="content-wrapper">
        <motion.h2
          className="text-section-title font-display mb-16 text-center"
          variants={sectionTitle}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {experience.title.leading} <span className="gradient-text">{experience.title.accent}</span>
        </motion.h2>

        {/* Main Story */}
        <motion.div
          variants={storyPanelVariant}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mb-16"
          whileHover={{
            y: -10,
            scale: 1.01,
            boxShadow: '0 30px 60px rgba(56, 189, 248, 0.15), 0 0 40px rgba(56, 189, 248, 0.1)',
            transition: { duration: 0.4 }
          }}
        >
          <div className="glass p-8 md:p-12 rounded-3xl bg-gradient-to-br from-sky-blue/20 to-teal/20">
            <div className="inline-block px-4 py-2 bg-gradient-blue rounded-full text-sm font-semibold mb-6">
              {story.badge}
            </div>

            <h3 className="text-3xl font-bold mb-6 gradient-text">{story.headline}</h3>

            {story.paragraphs.map((paragraph, index) => {
              const isFirst = index === 0
              const isLast = index === story.paragraphs.length - 1
              return (
                <p
                  key={`story-${index}`}
                  className={`${isFirst ? 'text-xl' : 'text-lg'} text-light-gray ${isLast ? '' : 'mb-6'} leading-relaxed`}
                  dangerouslySetInnerHTML={renderHtml(paragraph)}
                />
              )
            })}
          </div>
        </motion.div>

        {/* Legacy Environment Section */}
        <motion.div
          variants={legacyPanelVariant}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mb-12"
          whileHover={{ y: -3, transition: { duration: 0.3 } }}
        >
          <div className="glass p-8 rounded-2xl border-l-4 border-red-500/50">
            <h4 className="text-2xl font-semibold mb-4 text-red-400">{legacy.title}</h4>
            <p className="text-base text-light-gray mb-5 leading-relaxed">{legacy.intro}</p>
            <ul className={`space-y-3 text-light-gray reveal-list ${isVisible ? 'is-visible' : ''}`}>
              {legacy.items.map((item, index) => (
                <li key={`legacy-${index}`} className="flex items-start gap-3 reveal-item">
                  <span className="text-red-500 mt-1 reveal-icon">▸</span>
                  <span dangerouslySetInnerHTML={renderHtml(item)} />
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Transformation Grid */}
        <div className="space-y-6 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              variants={gridCardVariant(true, 0.15)}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="glass p-6 rounded-2xl"
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <h4 className="text-xl font-semibold mb-4 gradient-text">{grid.cloudIdentity.title}</h4>
              <ul className={`space-y-3 text-base text-light-gray reveal-list ${isVisible ? 'is-visible' : ''}`}>
                {grid.cloudIdentity.items.map((item, index) => (
                  <li key={`cloud-${index}`} className="flex items-start gap-2 reveal-item">
                    <span className="text-sky-blue mt-1 reveal-icon">✓</span>
                    <span dangerouslySetInnerHTML={renderHtml(item)} />
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={gridCardVariant(false, 0.2)}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="glass p-6 rounded-2xl"
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <h4 className="text-xl font-semibold mb-4 gradient-text">{grid.remoteFirst.title}</h4>
              <ul className={`space-y-3 text-base text-light-gray reveal-list ${isVisible ? 'is-visible' : ''}`}>
                {grid.remoteFirst.items.map((item, index) => (
                  <li key={`remote-${index}`} className="flex items-start gap-2 reveal-item">
                    <span className="text-baby-blue mt-1 reveal-icon">✓</span>
                    <span dangerouslySetInnerHTML={renderHtml(item)} />
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              variants={gridCardVariant(true, 0.25)}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="glass p-6 rounded-2xl"
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <h4 className="text-xl font-semibold mb-4 gradient-text">{grid.deviceLifecycle.title}</h4>
              <ul className={`space-y-3 text-base text-light-gray reveal-list ${isVisible ? 'is-visible' : ''}`}>
                {grid.deviceLifecycle.items.map((item, index) => (
                  <li key={`device-${index}`} className="flex items-start gap-2 reveal-item">
                    <span className="text-baby-blue mt-1 reveal-icon">✓</span>
                    <span dangerouslySetInnerHTML={renderHtml(item)} />
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={gridCardVariant(false, 0.3)}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="glass p-6 rounded-2xl"
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <h4 className="text-xl font-semibold mb-4 gradient-text">{grid.dualEnvironment.title}</h4>
              <ul className={`space-y-3 text-base text-light-gray reveal-list ${isVisible ? 'is-visible' : ''}`}>
                {grid.dualEnvironment.items.map((item, index) => (
                  <li key={`dual-${index}`} className="flex items-start gap-2 reveal-item">
                    <span className="text-ocean-blue mt-1 reveal-icon">✓</span>
                    <span dangerouslySetInnerHTML={renderHtml(item)} />
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            variants={centerPanelVariant(0.35)}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="glass p-8 rounded-2xl"
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
          >
            <h4 className="text-2xl font-semibold mb-6 gradient-text text-center">{security.title}</h4>
            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 reveal-list ${isVisible ? 'is-visible' : ''}`}>
              {security.items.map((item, index) => (
                <div key={`security-${index}`} className="flex items-start gap-2 text-base text-light-gray reveal-item">
                  <span className="text-teal mt-1 reveal-icon">✓</span>
                  <span dangerouslySetInnerHTML={renderHtml(item)} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="glass border border-emerald-400/40 bg-emerald-500/10 px-5 py-3 rounded-full text-sm text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                {security.scorecard.labelPrefix}{' '}
                <strong className="text-emerald-100">{security.scorecard.value}</strong>{' '}
                {security.scorecard.labelSuffix}
              </div>
              <p className="text-xs text-soft-gray">{security.scorecard.current}</p>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6">
              <h5 className="text-lg font-semibold mb-4 text-center text-pure-white">{security.platform.title}</h5>
              <div className={`grid md:grid-cols-2 gap-x-8 gap-y-3 text-base text-light-gray reveal-list ${isVisible ? 'is-visible' : ''}`}>
                {security.platform.items.map((item, index) => (
                  <div key={`platform-${index}`} className="flex items-start gap-2 reveal-item">
                    <span className="text-sky-blue mt-1 reveal-icon">▹</span>
                    <span dangerouslySetInnerHTML={renderHtml(item)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6">
              <h5 className="text-lg font-semibold mb-4 text-center text-pure-white">{security.hybrid.title}</h5>
              <div className={`grid md:grid-cols-2 gap-x-8 gap-y-3 text-base text-light-gray reveal-list ${isVisible ? 'is-visible' : ''}`}>
                {security.hybrid.items.map((item, index) => (
                  <div key={`hybrid-${index}`} className="flex items-start gap-2 reveal-item">
                    <span className="text-sky-blue mt-1 reveal-icon">▹</span>
                    <span dangerouslySetInnerHTML={renderHtml(item)} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={centerPanelVariant(0.4)}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="glass p-6 rounded-2xl"
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
          >
            <h4 className="text-xl font-semibold mb-3 gradient-text text-center">{luminos.title}</h4>
            <p className="text-center text-base text-light-gray mb-4">{luminos.intro}</p>
            <div className={`grid md:grid-cols-2 gap-x-8 gap-y-3 mb-4 reveal-list ${isVisible ? 'is-visible' : ''}`}>
              {luminos.items.map((item, index) => (
                <div key={`luminos-${index}`} className="flex items-start gap-2 text-base text-light-gray reveal-item">
                  <span className="text-aqua mt-1 reveal-icon">✓</span>
                  <span dangerouslySetInnerHTML={renderHtml(item)} />
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-sm text-center text-soft-gray mb-3">
                <strong className="text-pure-white">{luminos.securityLabel}</strong>
              </p>
              <div className={`grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-light-gray reveal-list ${isVisible ? 'is-visible' : ''}`}>
                {luminos.securityItems.map((item, index) => (
                  <div key={`luminos-security-${index}`} className="flex items-start gap-2 reveal-item">
                    <span className="text-teal mt-0.5 reveal-icon">▹</span>
                    <span dangerouslySetInnerHTML={renderHtml(item)} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={teamBadgeVariant}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mb-12 text-center"
        >
          <motion.div
            className="inline-block glass p-6 rounded-2xl border-2 border-sky-blue/30"
            whileHover={{ scale: 1.03, y: -3, transition: { duration: 0.3 } }}
          >
            <p className="text-xl md:text-2xl font-semibold mb-2">
              <span className="gradient-text">{team.headline}</span>
            </p>
            <p className="text-sm text-light-gray">{team.body}</p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={outcomeVariant}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="glass p-8 md:p-12 rounded-3xl bg-gradient-to-br from-green-500/20 to-sky-blue/20"
          whileHover={{ y: -4, transition: { duration: 0.3 } }}
        >
          <h4 className="text-2xl font-semibold mb-6 text-green-400">{outcome.title}</h4>
          <div className="grid md:grid-cols-2 gap-6 text-light-gray">
            <div>
              {outcome.left.map((item, index) => (
                <p key={`outcome-left-${index}`} className="mb-3">
                  ✓ <span dangerouslySetInnerHTML={renderHtml(item)} />
                </p>
              ))}
            </div>
            <div>
              {outcome.right.map((item, index) => (
                <p key={`outcome-right-${index}`} className="mb-3">
                  ✓ <span dangerouslySetInnerHTML={renderHtml(item)} />
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={timelineContainerVariant}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mt-12 text-center"
        >
          <motion.h4
            className="text-xl font-semibold mb-8"
            variants={timelineItemVariant}
          >
            {timeline.title}
          </motion.h4>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            {timeline.items.map((item, index) => (
              <div key={`${item.year}-${item.role}`} className="flex items-center gap-4">
                <motion.div
                  variants={timelineItemVariant}
                  className={`glass px-7 py-3 rounded-full border border-white/25 shadow-[0_0_25px_rgba(56,189,248,0.18)] ${
                    item.highlight ? 'bg-space-black/60' : 'bg-space-black/50'
                  }`}
                  whileHover={{ scale: 1.05, y: -3, transition: { duration: 0.25 } }}
                >
                  <span className="text-pure-white text-sm">{item.year}</span>
                  <p className={`font-semibold ${item.highlight ? 'gradient-text' : 'text-pure-white'}`}>
                    {item.role}
                  </p>
                </motion.div>

                {index < timeline.items.length - 1 && (
                  <motion.span
                    variants={timelineItemVariant}
                    className={`${item.accent} text-2xl`}
                  >
                    →
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
