import { motion } from 'framer-motion'

export default function Hero() {
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
            <span className="gradient-text">Leo Chui</span>
          </motion.h1>

          <motion.h2
            className="text-3xl md:text-4xl font-light mb-8 text-soft-gray"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Associate IT Director • <span className="text-pure-white">GLAAD</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-light-gray max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            Cloud security leader and full-stack builder. Led a 72-hour migration from Windows Server 2008
            to a cloud-native stack when COVID-19 hit. Featured by{' '}
            <a
              href="https://blog.google/outreach-initiatives/grow-with-google/-it-support-comptia/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-blue hover:text-baby-blue underline transition-colors"
            >
              Google
            </a>
            {' '}and{' '}
            <a
              href="https://www.comptia.org/en-us/blog/it-takes-two-comptia-and-google-put-high-growth-tech-jobs-within-reach/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-blue hover:text-baby-blue underline transition-colors"
            >
              CompTIA
            </a>
            {' '}for a career transition story.
          </motion.p>

          <motion.div
            className="flex gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <a
              href="#projects"
              className="px-8 py-4 bg-gradient-blue rounded-full text-pure-white font-semibold
                       hover:scale-105 transition-transform duration-300 ease-apple"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-8 py-4 glass rounded-full text-pure-white font-semibold
                       hover:scale-105 transition-transform duration-300 ease-apple"
            >
              Get in Touch
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
