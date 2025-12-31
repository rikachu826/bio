import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import content from '../content/site.json'

interface Project {
  title: string
  description: string
  origin?: string
  tech: string[]
  featured?: boolean
  category: string
  highlights: string[]
  details?: ProjectDetailSection[]
  screenshotsFolder?: string
}

interface ProjectDetailSection {
  title: string
  items: string[]
}

interface Screenshot {
  src: string
  name: string
  caption?: string
  isVideo?: boolean
  sources?: Array<{ src: string; type: string }>
}

const projectsSection = content.projectsSection
const projects: Project[] = content.projects as Project[]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px", amount: 0.15 })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0)
  const [lightboxError, setLightboxError] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const screenshotsByFolder = useRef(
    Object.entries(
      import.meta.glob('/Images/projects/**/*.{png,jpg,jpeg,webp,mp4,webm}', {
        eager: true,
        import: 'default',
      })
    ).reduce<Record<string, Screenshot[]>>((acc, [path, src]) => {
      const match = path.match(/\/Images\/projects\/([^/]+)\/(.+)$/)
      if (!match) {
        return acc
      }
      const folder = match[1]
      const name = match[2]
      const isVideo = /\.(mp4|webm)$/i.test(name)
      if (!acc[folder]) {
        acc[folder] = []
      }
      acc[folder].push({ src: src as string, name, isVideo })
      return acc
    }, {})
  )
  const captionsByFolder = useRef(
    Object.entries(
      import.meta.glob('/Images/projects/**/captions.json', {
        eager: true,
        import: 'default',
      })
    ).reduce<Record<string, Record<string, string>>>((acc, [path, data]) => {
      const match = path.match(/\/Images\/projects\/([^/]+)\/captions\.json$/)
      if (!match) {
        return acc
      }
      acc[match[1]] = data as Record<string, string>
      return acc
    }, {})
  )

  const projectScreenshots = useMemo(() => {
    if (!selectedProject?.screenshotsFolder) {
      return []
    }
    const folder = selectedProject.screenshotsFolder
    const screenshots = screenshotsByFolder.current[folder] ?? []
    const captions = captionsByFolder.current[folder] ?? {}
    const videoSources = new Map<string, { mp4?: string; webm?: string }>()

    screenshots.forEach((shot) => {
      if (!shot.isVideo) {
        return
      }
      const lowerName = shot.name.toLowerCase()
      const base = lowerName.replace(/\.(mp4|webm)$/i, '')
      const entry = videoSources.get(base) ?? {}
      if (lowerName.endsWith('.mp4')) {
        entry.mp4 = shot.src
      } else if (lowerName.endsWith('.webm')) {
        entry.webm = shot.src
      }
      videoSources.set(base, entry)
    })

    const sorted = screenshots.slice().sort((a, b) => a.name.localeCompare(b.name))
    const normalized: Screenshot[] = []

    for (const shot of sorted) {
      const lowerName = shot.name.toLowerCase()
      const base = lowerName.replace(/\.(mp4|webm)$/i, '')
      const source = videoSources.get(base)
      const hasWebm = Boolean(source?.webm)
      const hasMp4 = Boolean(source?.mp4)
      const isMp4 = lowerName.endsWith('.mp4')
      const isWebm = lowerName.endsWith('.webm')

      if (shot.isVideo && hasWebm && isMp4) {
        continue
      }

      const sources = shot.isVideo
        ? [
            hasWebm ? { src: source?.webm as string, type: 'video/webm' } : null,
            hasMp4 ? { src: source?.mp4 as string, type: 'video/mp4' } : null,
          ].filter(Boolean) as Array<{ src: string; type: string }>
        : undefined

      const fallbackType = isWebm ? 'video/webm' : 'video/mp4'
      const primarySrc = shot.isVideo
        ? (isWebm && source?.webm ? source.webm : source?.mp4 || shot.src)
        : shot.src

      normalized.push({
        ...shot,
        src: primarySrc,
        caption: captions[shot.name] ?? '',
        sources:
          sources && sources.length > 0
            ? sources
            : shot.isVideo
              ? [{ src: shot.src, type: fallbackType }]
              : undefined,
      })
    }

    return normalized
  }, [selectedProject?.screenshotsFolder])

  useEffect(() => {
    if (!selectedProject) {
      return
    }
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
    }
  }, [selectedProject])

  useEffect(() => {
    if (!selectedScreenshot) {
      return
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedScreenshot(null)
      }
      if (event.key === 'ArrowRight') {
        if (projectScreenshots.length > 0) {
          setSelectedScreenshotIndex((prev) => (prev + 1) % projectScreenshots.length)
        }
      }
      if (event.key === 'ArrowLeft') {
        if (projectScreenshots.length > 0) {
          setSelectedScreenshotIndex((prev) => (prev - 1 + projectScreenshots.length) % projectScreenshots.length)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedScreenshot, projectScreenshots.length])

  useEffect(() => {
    setLightboxError(false)
  }, [selectedScreenshotIndex, selectedScreenshot])

  const showNextScreenshot = () => {
    if (projectScreenshots.length === 0) {
      return
    }
    setSelectedScreenshotIndex((prev) => (prev + 1) % projectScreenshots.length)
  }

  const showPrevScreenshot = () => {
    if (projectScreenshots.length === 0) {
      return
    }
    setSelectedScreenshotIndex((prev) => (prev - 1 + projectScreenshots.length) % projectScreenshots.length)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = null
    touchStartX.current = event.targetTouches[0]?.clientX ?? null
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = event.targetTouches[0]?.clientX ?? null
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      return
    }
    const delta = touchStartX.current - touchEndX.current
    if (Math.abs(delta) < 50) {
      return
    }
    if (delta > 0) {
      showNextScreenshot()
    } else {
      showPrevScreenshot()
    }
  }

  useEffect(() => {
    if (!selectedScreenshot) {
      return
    }
    const nextSrc = projectScreenshots[selectedScreenshotIndex]
    if (nextSrc?.src) {
      setSelectedScreenshot(nextSrc.src)
    }
  }, [selectedScreenshotIndex, projectScreenshots, selectedScreenshot])

  const activeShot = projectScreenshots[selectedScreenshotIndex]
  const activeFallbackSrc = activeShot?.src || selectedScreenshot || ''
  const activeSources =
    activeShot?.sources && activeShot.sources.length > 0
      ? activeShot.sources
      : [{ src: activeFallbackSrc, type: 'video/mp4' }]

  return (
    <>
      <div className="section-container py-20" ref={ref}>
        <div className="content-wrapper">
          <motion.h2
            className="text-section-title font-display mb-16 text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {projectsSection.title.leading}{' '}
            <span className="gradient-text">{projectsSection.title.accent}</span>
          </motion.h2>

          <motion.p
            className="text-center text-light-gray text-lg mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            dangerouslySetInnerHTML={{ __html: projectsSection.intro }}
          />

          {/* Featured Projects */}
          <div className="space-y-8 mb-8">
            {projects.filter(p => p.featured).map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelectedProject(project)}
                className="glass p-8 rounded-2xl bg-gradient-to-br from-sky-blue/20 to-teal/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                      <div className="inline-block px-3 py-1 bg-gradient-blue rounded-full text-sm font-semibold mb-3">
                        ⭐ Featured
                      </div>
                    <h3 className="text-3xl font-semibold mb-2 group-hover:gradient-text transition-all">
                      {project.title}
                    </h3>
                    <p className="text-base text-aqua mb-3">{project.category}</p>
                  </div>
                  <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">
                    🖼️
                  </div>
                </div>

                <p className="text-light-gray mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-base font-semibold mb-3 text-pure-white">Key Features:</h4>
                  <ul className={`grid md:grid-cols-2 gap-2 reveal-list ${isInView ? 'is-visible' : ''}`}>
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-base text-light-gray reveal-item">
                        <span className="text-sky-blue mt-1 reveal-icon">▹</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-charcoal/80 rounded-full text-sm text-sky-blue border border-sky-blue/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Other Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(p => !p.featured).map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.6, delay: (index + 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelectedProject(project)}
                className="glass p-6 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-semibold group-hover:gradient-text transition-all">
                    {project.title}
                  </h3>
                  <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                    🖼️
                  </div>
                </div>
                <p className="text-sm text-aqua mb-3">{project.category}</p>
                <p className="text-light-gray mb-4 text-base leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-charcoal/50 rounded-full text-sm text-sky-blue border border-sky-blue/30"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="px-2 py-1 text-sm text-soft-gray">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mt-12"
          >
            <p className="text-light-gray">
              Production deployments run on <strong className="gradient-text">Firebase Hosting + Functions</strong> with signed desktop packaging
            </p>
          </motion.div>
        </div>
      </div>

      {/* Modal for Project Screenshots */}
      {selectedProject &&
        typeof document !== 'undefined' &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-hidden overscroll-contain"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="glass project-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto overscroll-contain rounded-3xl p-8"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-4xl font-bold gradient-text mb-2">{selectedProject.title}</h3>
                  <p className="text-aqua">{selectedProject.category}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-soft-gray hover:text-pure-white text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <p className="text-light-gray mb-6 text-lg leading-relaxed">
                {selectedProject.description}
              </p>

              {selectedProject.origin && (
                <p className="text-sm md:text-base text-soft-gray mb-6">
                  <span className="text-pure-white font-semibold">Name origin:</span> {selectedProject.origin}
                </p>
              )}

              {selectedProject.details && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4">Project Details</h4>
                  <div className="space-y-4">
                    {selectedProject.details.map((section) => (
                      <div
                        key={section.title}
                        className="rounded-2xl border border-white/10 bg-charcoal/50 p-5"
                      >
                        <h5 className="text-lg font-semibold mb-3 text-pure-white">{section.title}</h5>
                        <ul className="space-y-2 text-base text-light-gray leading-relaxed reveal-list is-visible">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 reveal-item">
                              <span className="text-sky-blue mt-1 reveal-icon">▹</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-4">Key Features</h4>
                <ul className="space-y-2 reveal-list is-visible">
                  {selectedProject.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-light-gray reveal-item">
                      <span className="text-sky-blue mt-1 reveal-icon">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-4">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-charcoal/80 rounded-full text-base text-sky-blue border border-sky-blue/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {projectScreenshots.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold mb-4">Screenshots</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                  {projectScreenshots.map((shot, index) => (
                    <div
                      key={`${shot.src}-${index}`}
                        className="project-screenshot-card rounded-2xl border border-white/10 bg-charcoal/40 p-3 cursor-zoom-in"
                        data-caption={shot.caption?.trim() ? shot.caption : shot.name}
                        aria-label={shot.caption?.trim() ? shot.caption : shot.name}
                        onClick={() => {
                          setSelectedScreenshot(shot.src)
                          setSelectedScreenshotIndex(index)
                        }}
                        onTouchEnd={() => {
                          setSelectedScreenshot(shot.src)
                          setSelectedScreenshotIndex(index)
                        }}
                      >
                        {shot.isVideo ? (
                          <video
                            className="w-full rounded-xl object-cover"
                            muted
                            playsInline
                            loop
                            autoPlay
                            preload="metadata"
                            controls
                          >
                            {(shot.sources && shot.sources.length > 0 ? shot.sources : [{ src: shot.src, type: 'video/mp4' }]).map((source) => (
                              <source key={source.src} src={source.src} type={source.type} />
                            ))}
                          </video>
                        ) : (
                          <img
                            src={shot.src}
                            alt={`${selectedProject.title} screenshot ${index + 1}`}
                            title={shot.caption?.trim() ? shot.caption : shot.name}
                            className="w-full rounded-xl object-cover"
                            loading="lazy"
                          />
                        )}
                        {shot.caption?.trim() ? (
                          <p className="mt-2 text-sm text-soft-gray/90">
                            {shot.caption}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-soft-gray/30 rounded-xl p-12 text-center">
                  <div className="text-6xl mb-4 opacity-50">📸</div>
                  <p className="text-soft-gray">
                    Screenshots coming soon
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>,
          document.body
        )}

      {selectedScreenshot &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedScreenshot(null)}
          >
            <div
              className="screenshot-lightbox"
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="screenshot-nav"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <button
                  type="button"
                  className="screenshot-arrow"
                  aria-label="Previous screenshot"
                  onClick={showPrevScreenshot}
                >
                  ←
                </button>
                <div
                  className="screenshot-figure"
                  data-caption={
                    projectScreenshots[selectedScreenshotIndex]?.caption?.trim() ||
                    projectScreenshots[selectedScreenshotIndex]?.name ||
                    ''
                  }
                >
                  {lightboxError ? (
                    <div className="max-h-[85vh] w-[80vw] max-w-[92vw] rounded-2xl bg-space-black/70 border border-white/10 flex flex-col items-center justify-center p-8 text-center">
                      <p className="text-pure-white mb-2">Media failed to load on this device.</p>
                      <a
                        href={projectScreenshots[selectedScreenshotIndex]?.src || selectedScreenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-blue underline"
                      >
                        Open file in a new tab
                      </a>
                    </div>
                  ) : projectScreenshots[selectedScreenshotIndex]?.isVideo ? (
                    <motion.video
                      key={projectScreenshots[selectedScreenshotIndex]?.src || selectedScreenshot}
                      className="max-h-[85vh] w-auto max-w-[92vw] rounded-2xl object-contain"
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      preload="metadata"
                      onError={() => setLightboxError(true)}
                      onClick={(event) => {
                        const target = event.currentTarget
                        if (target.paused) {
                          target.play().catch(() => {})
                        } else {
                          target.pause()
                        }
                      }}
                      onTouchEnd={(event) => {
                        const target = event.currentTarget
                        if (target.paused) {
                          target.play().catch(() => {})
                        } else {
                          target.pause()
                        }
                      }}
                      initial={{ opacity: 0, x: 24, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -24, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {activeSources.map((source) => (
                        <source key={source.src} src={source.src} type={source.type} />
                      ))}
                    </motion.video>
                  ) : (
                    <motion.img
                      key={activeFallbackSrc}
                      src={activeFallbackSrc}
                      alt="Project screenshot"
                      className="max-h-[85vh] w-auto max-w-[92vw] rounded-2xl object-contain"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onError={() => setLightboxError(true)}
                      initial={{ opacity: 0, x: 24, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -24, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </div>
                <button
                  type="button"
                  className="screenshot-arrow"
                  aria-label="Next screenshot"
                  onClick={showNextScreenshot}
                >
                  →
                </button>
              </div>

              <div className="screenshot-indicators">
                <span className="screenshot-counter">
                  {selectedScreenshotIndex + 1} / {projectScreenshots.length}
                </span>
                {projectScreenshots[selectedScreenshotIndex]?.caption?.trim() ? (
                  <span className="screenshot-caption">
                    {projectScreenshots[selectedScreenshotIndex]?.caption}
                  </span>
                ) : null}
                <div className="screenshot-dots">
                  {projectScreenshots.map((_, index) => (
                    <span
                      key={`dot-${index}`}
                      className={`screenshot-dot ${index === selectedScreenshotIndex ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
