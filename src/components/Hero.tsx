import { motion } from 'framer-motion'
import content from '../content/site.json'

export default function Hero() {
  const hero = content.hero

  return (
    <div id="top" className="section-container min-h-screen">
      <div className="content-wrapper text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h1
            className="text-hero font-display mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="gradient-text">{hero.name}</span>
          </motion.h1>

          <motion.h2
            className="text-3xl md:text-4xl font-light mb-8 text-soft-gray"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {hero.role} • <span className="text-pure-white">{hero.org}</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-light-gray max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            {hero.summaryParts.map((part, index) =>
              part.type === 'link' ? (
                <a
                  key={`${part.text}-${index}`}
                  href={part.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-blue hover:text-baby-blue underline transition-colors"
                >
                  {part.text}
                </a>
              ) : (
                <span key={`text-${index}`}>{part.value}</span>
              )
            )}
          </motion.p>

          <motion.div
            className="flex gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <a
              href={hero.cta.primary.href}
              className="px-8 py-4 bg-gradient-blue rounded-full text-pure-white font-semibold
                       hover:scale-105 transition-transform duration-300 ease-apple"
            >
              {hero.cta.primary.label}
            </a>
            <a
              href={hero.cta.secondary.href}
              className="px-8 py-4 glass rounded-full text-pure-white font-semibold
                       hover:scale-105 transition-transform duration-300 ease-apple"
            >
              {hero.cta.secondary.label}
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-soft-gray rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-gradient-blue rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
