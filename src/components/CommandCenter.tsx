import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import content from '../content/site.json'

type Slide = {
  src: string
  title: string
  description: string
  alt: string
  key: string
  isVideo: boolean
  sources?: Array<{ src: string; type: string }>
}

type CommandCenterProps = {
  paused?: boolean
}

const imageModules = import.meta.glob('/Images/**/*.{jpg,jpeg,png,webp,mp4,webm}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

type CommandCaption = {
  title?: string
  description?: string
}

const commandCaptionsModule = import.meta.glob('/Images/command-center/captions.json', {
  eager: true,
  import: 'default',
})

const commandCaptionsRaw = (Object.values(commandCaptionsModule)[0] ?? {}) as Record<
  string,
  CommandCaption | string
>

const commandCaptions: Record<string, CommandCaption> = Object.entries(commandCaptionsRaw).reduce(
  (acc, [key, value]) => {
    const normalized =
      typeof value === 'string'
        ? { description: value }
        : {
            title: value?.title,
            description: value?.description,
          }
    acc[key.toLowerCase()] = normalized
    return acc
  },
  {} as Record<string, CommandCaption>
)

const commandKeywords = ['command', 'desk', 'workstation', 'rig', 'setup', 'command-center']

export default function CommandCenter({ paused = false }: CommandCenterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px", amount: 0.15 })
  const commandCenter = content.commandCenter
  const [isTabVisible, setIsTabVisible] = useState(true)
  const [visibilityTick, setVisibilityTick] = useState(0)
  const wasPausedRef = useRef(paused)
  const slides = useMemo<Slide[]>(() => {
    const entries = Object.entries(imageModules)
      .map(([path, src]) => {
        const fileName = path.split('/').pop() || ''
        const lower = fileName.toLowerCase()
        const inCommandFolder = path.toLowerCase().includes('/command-center/')
        const isRank = lower === 'rank1.jpg'
        const isCommand = inCommandFolder || commandKeywords.some((keyword) => lower.includes(keyword))
        if (!isRank && !isCommand) {
          return null
        }
        const isVideo = /\.(mp4|webm)$/i.test(lower)
        const base = lower.replace(/\.(mp4|webm)$/i, '')
        const caption =
          commandCaptions[lower] ||
          (isVideo
            ? commandCaptions[`${base}.webm`] || commandCaptions[`${base}.mp4`]
            : undefined)
        const fallbackTitle = 'Command Center'
        const fallbackDescription = 'Multi-system workspace built for parallel research and monitoring.'
        const title = caption?.title?.trim() || fallbackTitle
        const description = caption?.description?.trim() || fallbackDescription
        return {
          src,
          title,
          description,
          alt: title,
          key: lower,
          isVideo,
          videoKey: isVideo ? base : '',
        }
      })
      .filter((entry): entry is Slide & { videoKey: string } => Boolean(entry))

    const videoSources = new Map<string, { mp4?: string; webm?: string }>()
    entries.forEach((entry) => {
      if (!entry.isVideo || !entry.videoKey) {
        return
      }
      const source = videoSources.get(entry.videoKey) ?? {}
      if (entry.key.endsWith('.mp4')) {
        source.mp4 = entry.src
      } else if (entry.key.endsWith('.webm')) {
        source.webm = entry.src
      }
      videoSources.set(entry.videoKey, source)
    })

    const normalizedEntries = entries
      .map((entry) => {
        if (!entry.isVideo || !entry.videoKey) {
          return entry
        }
        const source = videoSources.get(entry.videoKey)
        const hasWebm = Boolean(source?.webm)
        const hasMp4 = Boolean(source?.mp4)
        const isMp4 = entry.key.endsWith('.mp4')
        const isWebm = entry.key.endsWith('.webm')

        if (hasWebm && isMp4) {
          return null
        }

        const sources = [
          hasWebm ? { src: source?.webm as string, type: 'video/webm' } : null,
          hasMp4 ? { src: source?.mp4 as string, type: 'video/mp4' } : null,
        ].filter(Boolean) as Array<{ src: string; type: string }>
        const fallbackType = isWebm ? 'video/webm' : 'video/mp4'
        const primarySrc = isWebm && source?.webm ? source.webm : source?.mp4 || entry.src

        return {
          ...entry,
          src: primarySrc,
          sources: sources.length > 0 ? sources : [{ src: entry.src, type: fallbackType }],
        }
      })
      .filter((entry): entry is Slide & { videoKey: string } => Boolean(entry))

    return normalizedEntries.sort((a, b) => {
      if (a.key === 'rank1.jpg') return 1
      if (b.key === 'rank1.jpg') return -1
      return a.key.localeCompare(b.key)
    })
  }, [])

  const [activeIndex, setActiveIndex] = useState(0)
  const slideCount = slides.length

  const goNext = useCallback(() => {
    if (slideCount === 0) {
      return
    }
    setActiveIndex((prev) => (prev + 1) % slideCount)
  }, [slideCount])

  const goPrev = useCallback(() => {
    if (slideCount === 0) {
      return
    }
    setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount)
  }, [slideCount])

  useEffect(() => {
    if (!isInView || slideCount <= 1 || !isTabVisible || paused) {
      return
    }
    const timer = window.setInterval(goNext, 8500)
    return () => window.clearInterval(timer)
  }, [goNext, isInView, slideCount, isTabVisible, paused])

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible'
      setIsTabVisible(visible)
      if (visible) {
        setVisibilityTick((prev) => prev + 1)
      }
    }
    handleVisibilityChange()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    if (wasPausedRef.current && !paused) {
      setVisibilityTick((prev) => prev + 1)
    }
    wasPausedRef.current = paused
  }, [paused])

  if (slides.length === 0) {
    return null
  }

  const activeSlide = slides[activeIndex]

  return (
    <div className="section-container py-20" ref={ref}>
      <div className="content-wrapper">
        <motion.h2
          className="text-section-title font-display mb-6 text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {commandCenter.title.leading}{' '}
          <span className="gradient-text">{commandCenter.title.accent}</span>
        </motion.h2>

        <motion.p
          className="text-center text-light-gray text-lg mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {commandCenter.intro}
        </motion.p>

        <div className="glass bg-charcoal/60 rounded-3xl p-6 md:p-8 border border-white/10">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-space-black/60">
            <AnimatePresence mode="wait">
              {activeSlide.isVideo ? (
                <motion.video
                  key={`${activeSlide.key}-${visibilityTick}`}
                  className="w-full h-[320px] md:h-[460px] object-contain bg-space-black"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {(activeSlide.sources && activeSlide.sources.length > 0
                    ? activeSlide.sources
                    : [{ src: activeSlide.src, type: 'video/mp4' }]
                  ).map((source) => (
                    <source key={source.src} src={source.src} type={source.type} />
                  ))}
                </motion.video>
              ) : (
                <motion.img
                  key={`${activeSlide.key}-${visibilityTick}`}
                  src={activeSlide.src}
                  alt={activeSlide.alt}
                  className="w-full h-[320px] md:h-[460px] object-contain bg-space-black"
                  loading="eager"
                  decoding="async"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-pure-white">{activeSlide.title}</h3>
              <p className="text-sm text-light-gray mt-1">{activeSlide.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous slide"
                className="glass h-10 w-10 rounded-full flex items-center justify-center text-lg text-pure-white
                           hover:scale-105 transition-transform duration-200 ease-apple"
                disabled={slideCount <= 1}
              >
                ←
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next slide"
                className="glass h-10 w-10 rounded-full flex items-center justify-center text-lg text-pure-white
                           hover:scale-105 transition-transform duration-200 ease-apple"
                disabled={slideCount <= 1}
              >
                →
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  index === activeIndex
                    ? 'w-8 bg-sky-blue'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
