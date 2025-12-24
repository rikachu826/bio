import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { generateResumePdf } from '../utils/resumePdf'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "0px 0px 0px 0px", amount: 0.1 })
  const [isGenerating, setIsGenerating] = useState(false)

  const contactMethods: { icon: JSX.Element; label: string; value: string; link: string }[] = [
    {
      icon: (
        <span className="envelope-icon" aria-hidden="true">
          <span className="envelope-letter" />
          <svg className="envelope-svg" viewBox="0 0 64 48" role="presentation">
            <rect className="envelope-back" x="4" y="10" width="56" height="30" rx="4" />
            <path className="envelope-front" d="M4 12L32 30L60 12V40H4Z" />
            <path className="envelope-flap" d="M4 12L32 30L60 12L32 6Z" />
          </svg>
        </span>
      ),
      label: 'Email',
      value: 'leo@leochui.tech',
      link: 'mailto:leo@leochui.tech'
    },
  ]

  return (
    <div className="section-container py-20" ref={ref}>
      <div className="content-wrapper max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 12 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2 className="text-section-title font-display mb-6">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-xl text-light-gray mb-12 max-w-2xl mx-auto">
            No social media, just engineering and continuous learning.
            If you want to talk cloud security, AI systems, or technical leadership, reach out.
          </p>
        </motion.div>

        <div className="flex justify-center mb-12">
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 8 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-6 rounded-2xl border border-white/30 bg-gradient-to-br from-space-black/70 via-slate-900/60 to-charcoal/70
                         hover:scale-105 hover:bg-white/15 hover:border-sky-blue/40 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="contact-icon group-hover:scale-110 transition-transform">
                  {method.icon}
                </div>
                <div className="text-left">
                  <div className="text-sm text-soft-gray mb-1 group-hover:gradient-text transition-all">
                    {method.label}
                  </div>
                  <div className="text-pure-white group-hover:gradient-text transition-all">
                    {method.value}
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 8 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <button
            type="button"
            onClick={async () => {
              setIsGenerating(true)
              try {
                await generateResumePdf()
              } finally {
                setIsGenerating(false)
              }
            }}
            className="inline-block px-8 py-4 bg-gradient-blue rounded-full text-pure-white font-semibold
                     hover:scale-105 transition-transform duration-300 ease-apple mb-8 disabled:opacity-70"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating PDF...' : 'Download Resume (PDF)'}
          </button>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0.6 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <a
                href="#top"
                aria-label="Back to top"
                className="glass h-11 w-11 rounded-full flex items-center justify-center text-lg text-pure-white
                         border border-sky-blue/30 shadow-[0_0_16px_rgba(79,172,254,0.25)]
                         animate-pulse-soft hover:scale-105 transition-transform duration-300 ease-apple"
              >
                ↑
              </a>
              <a
                href="https://github.com/rikachu826/bio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="glass h-11 w-11 rounded-full flex items-center justify-center text-pure-white
                         border border-sky-blue/30 shadow-[0_0_16px_rgba(79,172,254,0.25)]
                         hover:scale-105 transition-transform duration-300 ease-apple"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.02c0 4.424 2.865 8.19 6.839 9.517.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.467-1.11-1.467-.908-.62.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.53 2.341 1.088 2.91.832.09-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.104-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.6 9.6 0 0 1 2.504.337c1.909-1.296 2.748-1.026 2.748-1.026.546 1.378.204 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.944.36.309.68.92.68 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.02C22 6.484 17.523 2 12 2Z" />
                </svg>
              </a>
            </div>
            <p className="text-soft-gray text-sm">
              © 2025 Leo Chui
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
