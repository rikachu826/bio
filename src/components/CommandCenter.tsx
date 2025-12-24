import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Slide = {
  src: string
  title: string
  description: string
  alt: string
  key: string
}

const imageModules = import.meta.glob('/Images/**/*.{jpg,jpeg,png,webp}', {
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

export default function CommandCenter() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px", amount: 0.15 })
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
        const caption = commandCaptions[lower]
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
        }
      })
      .filter((entry): entry is Slide => Boolean(entry))
      .sort((a, b) => {
        if (a.key === 'rank1.jpg') return 1
        if (b.key === 'rank1.jpg') return -1
        return a.key.localeCompare(b.key)
      })

    return entries
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
    if (!isInView || slideCount <= 1) {
      return
    }
    const timer = window.setInterval(goNext, 8500)
    return () => window.clearInterval(timer)
  }, [goNext, isInView, slideCount])

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
          How I <span className="gradient-text">Work</span>
        </motion.h2>

        <motion.p
          className="text-center text-light-gray text-lg mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          A personal operations cockpit built for parallel research, incident response, and AI-accelerated delivery.
          Competitive raiding taught me how to turn preparation into execution under pressure.
        </motion.p>

        <div className="glass bg-charcoal/60 rounded-3xl p-6 md:p-8 border border-white/10">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-space-black/60">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeSlide.key}
                src={activeSlide.src}
                alt={activeSlide.alt}
                className="w-full h-[320px] md:h-[460px] object-contain bg-space-black"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
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
