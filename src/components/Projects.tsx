import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

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

const projects: Project[] = [
  {
    title: 'LuminOS',
    description: 'AI-native application ecosystem with domain-specific assistants across security, finance, media intelligence, and legal analysis. Web apps run on Firebase/GCP; the desktop app ships as a signed macOS build with server-side OAuth exchange.',
    origin: 'Named for GLAAD as a light pillar; LuminOS is the operating system that unifies every tool into one mission surface.',
    category: 'AI Application Ecosystem',
    tech: ['Firebase', 'GCP', 'React', 'TypeScript', 'Python', 'Vertex AI', 'Perplexity', 'Electron'],
    featured: true,
    highlights: [
      'Diffract: Executive cybersecurity dashboard with real-time threat intelligence',
      'Refract: Financial analytics unifying Salesforce + NetSuite with deep research',
      'Prism: Comprehensive media intelligence (IGDB, TMDB, Dash Social, Reddit, OpenMeasures)',
      'Spectrum: Modular exploratory analysis for pattern recognition',
      'NetRunner: Desktop legal analysis app',
      'AI personas: Aegis (security), Astraea (finance), LUMOS (media), IRIS (spectrum), Turing (legal)'
    ],
    details: [
      {
        title: 'Suite Purpose',
        items: [
          'Unifies executive operations into a single AI-native ecosystem spanning security, finance, media intelligence, and legal analysis.',
          'Dedicated AI personas per domain, with shared prompt/guardrail patterns and context injection.',
          'Designed to replace fragmented vendor workflows with a single pane of glass.'
        ]
      },
      {
        title: 'Naming & Mission',
        items: [
          'GLAAD is a light pillar for LGBTQ rights and representation; the suite names follow how light reveals truth.',
          'LuminOS is the operating system, a unified surface where each tool provides a different perspective.',
          'Each product name reflects its role in bending, separating, or shielding light to find insight.'
        ]
      },
      {
        title: 'Light Metaphors (by Product)',
        items: [
          'Diffract: stress-tests security posture to expose weak points and threats.',
          'Refract: bends financial signals to keep programs funded and aligned.',
          'Prism: splits media signals to surface sources, context, and coverage patterns.',
          'Spectrum: scans across the media landscape to find signal in the noise.',
          'NetRunner: cyberpunk-inspired legal sentinel protecting mission-critical risk.'
        ]
      },
      {
        title: 'Shared Architecture',
        items: [
          'React + TypeScript frontends on Firebase Hosting; Python backends on Cloud Functions; Electron desktop app for NetRunner.',
          'Vertex AI (Gemini) for chat/analysis, Perplexity for deep research where required, with model fallbacks for resilience.',
          'Firebase Auth + Secrets Manager across the web apps; App Check used where supported.'
        ]
      },
      {
        title: 'Cross-App Workflow',
        items: [
          'Apps ingest vendor signals (AWS, Proofpoint, Salesforce, NetSuite, IGDB, TMDB, Dash Social, and more).',
          'Data normalized in Firestore with cache layers to keep dashboards fast and stable.',
          'Context payloads flow into each assistant (Aegis/Astraea/LUMOS/IRIS/Turing) for executive summaries and recommendations.'
        ]
      },
      {
        title: 'Suite Milestones',
        items: [
          'Five production apps delivered in a rapid build sprint.',
          'Production deploy workflows across Firebase Hosting/Functions and signed desktop packaging.',
          'Dedicated sandbox environments for safe UI and animation experiments.'
        ]
      }
    ],
    screenshotsFolder: 'luminos'
  },
  {
    title: 'Diffract',
    description: 'Executive cybersecurity dashboard providing real-time visibility into organizational security posture, compliance status, and threat intelligence.',
    origin: 'Diffraction exposes weak points in a wave; Diffract surfaces weak points in security posture before they become incidents.',
    category: 'Security Analytics',
    tech: ['React', 'TypeScript', 'Firebase', 'Vertex AI', 'Python'],
    featured: true,
    highlights: [
      'Real-time security metrics and compliance tracking',
      'Monthly pen test status tracking',
      'Single-pane view of CrowdStrike, JumpCloud, Proofpoint status',
      'AI-powered threat analysis and recommendations'
    ],
    details: [
      {
        title: 'Purpose & Outcomes',
        items: [
          'Executive cybersecurity cockpit for GLAAD with a clear red/green narrative of risk and readiness.',
          'Aegis AI persona translates complex security signals into actionable guidance.',
          'Glass cockpit UI keeps posture at a glance without leaving the dashboard.'
        ]
      },
      {
        title: 'Build & Architecture',
        items: [
          'React + Vite frontend on Firebase Hosting; Python 3.12 Cloud Functions backend.',
          'Vertex AI Gemini 2.5 Flash primary with 2.0 Flash fallback; lazy init to reduce cold starts.',
          'Integrations: AWS WAF, Proofpoint, At-Bay (Gmail label scan), Google Drive; CrowdStrike mocked.'
        ]
      },
      {
        title: 'Workflow & Data Flow',
        items: [
          'User logs in via Firebase Auth; backend verifies ID token and @glaad.org domain on every call.',
          'get_dashboard_data aggregates cache-first metrics (WAF 15 min, Proofpoint 5 min, At-Bay 6h, Drive 60 min).',
          'Aegis chat validates auth and App Check, injects dashboard context, returns Gemini response with fallback.'
        ]
      },
      {
        title: 'Security & Ops Guardrails',
        items: [
          'Strict CORS allowlist, App Check (warn mode), secrets in Firebase Secret Manager.',
          'Proofpoint API requires urllib + manual Base64 auth to avoid 400 errors.',
          'Layout locked to h-screen + overflow-hidden; shimmer uses will-change to prevent CPU spikes.',
          'Hosting headers set no-cache for index.html to prevent stale deploys.'
        ]
      }
    ],
    screenshotsFolder: 'diffract'
  },
  {
    title: 'Refract',
    description: 'Financial analytics platform unifying Salesforce and NetSuite data with AI-powered deep research for executive decision-making and forecasting.',
    origin: 'Refraction bends light to reveal signal; Refract bends finance data into clear, executive-ready decisions.',
    category: 'Financial Intelligence',
    tech: ['React', 'TypeScript', 'Python', 'Salesforce API', 'NetSuite API', 'Vertex AI', 'Perplexity'],
    highlights: [
      'Single-pane-of-glass for Salesforce + NetSuite integration',
      'Real-time financial analytics without multiple system logins',
      'Deep research options for complex financial analysis',
      'AI-powered insights, forecasting, and strategic recommendations',
      'Custom reports designed for non-technical executives'
    ],
    details: [
      {
        title: 'Purpose & Outcomes',
        items: [
          'Executive finance and audit dashboard unifying Salesforce and NetSuite for GLAAD.',
          'Astraea AI analyst answers financial questions and produces executive-ready summaries.',
          'Intelligence Hub evaluates proposals with GO/CAUTION/NO-GO recommendations.'
        ]
      },
      {
        title: 'Build & Architecture',
        items: [
          'React + Vite + TypeScript frontend; Python 3.12 Cloud Functions backend.',
          'Salesforce REST via client credentials; NetSuite diagnostics and treasury views.',
          'Gemini chat via Vertex AI; Perplexity Sonar Pro and Gemini Interactions API for deep research; jsPDF exports; Sentry.'
        ]
      },
      {
        title: 'Workflow & Operations',
        items: [
          'Deploy via ./deploy_prod.sh to build frontend and deploy hosting + functions.',
          'Allowlist enforced in two layers: frontend ALLOWED_EMAILS and backend ALLOWED_USERS secret.',
          'Deep Research runs async with status polling; fallback to Gemini Flash if Interactions API fails.',
          'Proposal uploads are size-limited and PDF parsing is hardened with timeouts and subprocess fallback.'
        ]
      },
      {
        title: 'Security & Reliability',
        items: [
          'CSP report-only headers plus /csp-report endpoint for visibility.',
          'External links in markdown/citations are sanitized to http(s) only.',
          'Upload guardrails and dependency hardening (pypdf) reduce crafted-PDF risk.'
        ]
      }
    ],
    screenshotsFolder: 'refract'
  },
  {
    title: 'Prism',
    description: 'Comprehensive media intelligence platform integrating IGDB (video games), TMDB (movies/TV), OpenMeasures OSINT, Dash Social listening, and Reddit, plus AI collaboration via LUMOS for team decisions.',
    origin: 'A prism splits light into components; Prism separates media signals into sources, context, and actionable insight.',
    category: 'Media Analytics',
    tech: ['React', 'TypeScript', 'Firebase', 'Algolia', 'Vertex AI', 'Perplexity', 'IGDB', 'TMDB'],
    highlights: [
      'Auto-research modals for awards eligibility workflows (GLAAD Media Awards use case)',
      'LUMOS assistant supports group decision-making in collaboration threads',
      'Deep research via Perplexity with citations and AI summarization',
      'OSINT media search with OpenMeasures (partial integration)',
      'Social listening via Dash Social + News API intelligence',
      'Team collaboration with watch lists and shared research'
    ],
    details: [
      {
        title: 'Purpose & Outcomes',
        items: [
          'AI-powered media research dashboard for GLAAD across gaming, film/TV, and social listening.',
          'LUMOS assistant delivers context-aware summaries, deep research, and collaborative decision support.',
          'Watchlists, modal research, and shared findings support team workflows.'
        ]
      },
      {
        title: 'Build & Architecture',
        items: [
          'React + Vite frontend; Python 3.12 Cloud Functions backend; Firestore + Algolia.',
          'Integrations: IGDB (OAuth), Steam, TMDB, Dash Social, Reddit, Perplexity, Vertex AI; OpenMeasures partial.',
          'Weekly IGDB sync via scheduled function; TMDB sync triggered from Film/TV admin UI.'
        ]
      },
      {
        title: 'Workflow & Data Flow',
        items: [
          'Instant search uses Algolia index; deep search calls igdb_catalog_search when needed.',
          'Cloud Functions fetch external APIs, store to Firestore, Algolia extension syncs catalog data.',
          'LUMOS uses Gemini 2.5 Flash for analysis; Perplexity handles deep research with citations.',
          'Watchlist updates use arrayUnion merge to avoid last-write-wins overwrites.'
        ]
      },
      {
        title: 'Security & Ops Guardrails',
        items: [
          'Firebase Auth restricted to @glaad.org; App Check warn mode; secrets in Secret Manager.',
          'Firestore initialized lazily to avoid cold-start crashes; secrets .strip() to avoid newline bugs.',
          'Fallback handling for zero results and platform-specific 422 errors.'
        ]
      }
    ],
    screenshotsFolder: 'prism'
  },
  {
    title: 'Spectrum',
    description: 'Automated multi-source media intelligence platform for weekly executive reporting across the LGBTQ media landscape.',
    origin: 'Spectrum shows the full range of light; Spectrum scans the full media landscape to find signal in the noise.',
    category: 'Media Intelligence',
    tech: ['Python', 'Firebase', 'Vertex AI', 'AWS Comprehend', 'Perplexity', 'Chart.js'],
    highlights: [
      'Automated weekly report generation with scheduled runs',
      'CSV/Excel ingestion + normalization across Podchaser, MRI, Dash Social',
      'Sentiment analysis via AWS Comprehend + Gemini',
      'AI chatbot + Perplexity research modal with citations',
      'Interactive HTML dashboards with Chart.js'
    ],
    details: [
      {
        title: 'Purpose & Outcomes',
        items: [
          'Automated multi-source media intelligence delivering weekly executive dashboards.',
          'Aggregates Podchaser, MRI surveys, Dash Social, and meta-trend analysis with AI insights.',
          'Provides AI chatbot and research modal with citations for fast decisions.'
        ]
      },
      {
        title: 'Build & Architecture',
        items: [
          'Python 3.x automation; pure HTML/JS frontend with Chart.js (no build step).',
          'Gemini via Vertex AI (2.5 Flash primary, 2.0 Flash fallback) + AWS Comprehend + Perplexity.',
          'Firebase Hosting for dashboards; Cloud Functions for AI endpoints; Storage for archives.'
        ]
      },
      {
        title: 'Workflow & Data Flow',
        items: [
          'Ingest CSV/Excel into backend/data; parsers extract mentions, sentiment, and reach.',
          'automate_spectrum.py orchestrates analysis, dashboard generation, deploy, and archive.',
          'Weekly cron (Mon 9 AM) runs automation; MRI Explorer queue pulled from Firebase Storage.',
          'API-first with file fallback for Podchaser and Dash Social to prevent gaps.'
        ]
      },
      {
        title: 'Security & Ops Guardrails',
        items: [
          'Firebase Auth restricted to @glaad.org; ID tokens verified on every function.',
          'Secrets managed in Firebase Secret Manager; API keys never in frontend.',
          'Template workflow: edit template.html, regenerate dashboard via generator.py.'
        ]
      }
    ],
    screenshotsFolder: 'spectrum'
  },
  {
    title: 'NetRunner',
    description: 'Desktop application for AI-assisted legal document analysis and content scans.',
    origin: 'Cyberpunk-inspired netrunner archetype, a quiet legal sentinel protecting mission-critical risk.',
    category: 'Legal Tech',
    tech: ['Electron', 'TypeScript', 'React', 'Gemini', 'OAuth PKCE', 'Sentry'],
    highlights: [
      'Signed macOS desktop build',
      'Local scan archive with session persistence',
      'Rate-limit resilient batch scanning workflow',
      'Secure OAuth (PKCE) with server-side token exchange'
    ],
    details: [
      {
        title: 'Purpose & Outcomes',
        items: [
          'Local Electron desktop app for AI-assisted legal document and content scans.',
          'Turing AI panel provides deeper reasoning for flagged items and follow-up analysis.',
          'Scan sessions are stored locally for audit trails and reuse.'
        ]
      },
      {
        title: 'Build & Architecture',
        items: [
          'Electron main/renderer with Vite + React + TypeScript.',
          'Gemini 2.0 Flash for bulk scanning; Gemini 2.0 Flash Thinking for deep analysis.',
          'OAuth via system browser with PKCE; token exchange handled server-side in Firebase.'
        ]
      },
      {
        title: 'Workflow & Data Flow',
        items: [
          'User authenticates via loopback redirect (http://localhost:8893); app receives minimal profile.',
          'Scan batches run through bulk model; results summarized with thinking model.',
          'Scan results auto-saved to ~/Documents/NetRunner_Reports and accessible in-app.',
          'Session Logs, Tactical Analysis, and Turing AI panels slide in post-scan.'
        ]
      },
      {
        title: 'Security & Ops Guardrails',
        items: [
          'CSP + X-Frame-Options + nosniff headers; IPC path validation prevents traversal.',
          'Gemini API key stored with Electron safeStorage; plaintext keys auto-migrated.',
          'openExternal IPC blocks non-http(s) links; no client secret shipped in app.'
        ]
      }
    ],
    screenshotsFolder: 'netrunner'
  }
]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: "0px 0px 0px 0px", amount: 0.1 })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const screenshotsByFolder = useRef(
    Object.entries(
      import.meta.glob('/Images/projects/**/*.{png,jpg,jpeg,webp}', {
        eager: true,
        import: 'default',
      })
    ).reduce<Record<string, string[]>>((acc, [path, src]) => {
      const match = path.match(/\/Images\/projects\/([^/]+)\//)
      if (!match) {
        return acc
      }
      const folder = match[1]
      if (!acc[folder]) {
        acc[folder] = []
      }
      acc[folder].push(src as string)
      return acc
    }, {})
  )

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
        setSelectedScreenshotIndex((prev) => (prev + 1) % projectScreenshots.length)
      }
      if (event.key === 'ArrowLeft') {
        setSelectedScreenshotIndex((prev) => (prev - 1 + projectScreenshots.length) % projectScreenshots.length)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedScreenshot, projectScreenshots.length])

  const showNextScreenshot = () => {
    setSelectedScreenshotIndex((prev) => (prev + 1) % projectScreenshots.length)
  }

  const showPrevScreenshot = () => {
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

  const projectScreenshots = selectedProject?.screenshotsFolder
    ? (screenshotsByFolder.current[selectedProject.screenshotsFolder] ?? [])
    : []

  useEffect(() => {
    if (!selectedScreenshot) {
      return
    }
    const nextSrc = projectScreenshots[selectedScreenshotIndex]
    if (nextSrc) {
      setSelectedScreenshot(nextSrc)
    }
  }, [selectedScreenshotIndex, projectScreenshots, selectedScreenshot])

  return (
    <>
      <div className="section-container py-20" ref={ref}>
        <div className="content-wrapper">
          <motion.h2
            className="text-section-title font-display mb-16 text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            AI-Powered <span className="gradient-text">Projects</span>
          </motion.h2>

          <motion.p
            className="text-center text-light-gray text-lg mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0.6 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Built <strong className="text-pure-white">LuminOS</strong> as five production apps across web and desktop.
            Web apps run on Firebase/GCP; the desktop app uses Electron with server-side OAuth exchange. Click any project for details.
          </motion.p>

          {/* Featured Projects */}
          <div className="space-y-8 mb-8">
            {projects.filter(p => p.featured).map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24, scale: 0.99 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.6, y: 12, scale: 0.99 }}
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
                  <ul className="grid md:grid-cols-2 gap-2">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-base text-light-gray">
                        <span className="text-sky-blue mt-1">▹</span>
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
                initial={{ opacity: 0, y: 24, scale: 0.99 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.6, y: 12, scale: 0.99 }}
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
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 8 }}
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
                        <ul className="space-y-2 text-base text-light-gray leading-relaxed">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-sky-blue mt-1">▹</span>
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
                <ul className="space-y-2">
                  {selectedProject.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-light-gray">
                      <span className="text-sky-blue mt-1">✓</span>
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
                    {projectScreenshots.map((src, index) => (
                      <div
                        key={`${src}-${index}`}
                        className="rounded-2xl border border-white/10 bg-charcoal/40 p-3 cursor-zoom-in"
                        onClick={() => {
                          setSelectedScreenshot(src)
                          setSelectedScreenshotIndex(index)
                        }}
                      >
                        <img
                          src={src}
                          alt={`${selectedProject.title} screenshot ${index + 1}`}
                          className="w-full rounded-xl object-cover"
                          loading="lazy"
                        />
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
                <motion.img
                  key={projectScreenshots[selectedScreenshotIndex] || selectedScreenshot}
                  src={projectScreenshots[selectedScreenshotIndex] || selectedScreenshot}
                  alt="Project screenshot"
                  className="max-h-[85vh] w-auto max-w-[92vw] rounded-2xl object-contain"
                  initial={{ opacity: 0, x: 24, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -24, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
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
