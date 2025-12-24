import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px", amount: 0.15 })

  return (
    <div className="section-container" ref={ref}>
      <div className="content-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-section-title font-display mb-8">
            About <span className="gradient-text">Me</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-lg text-light-gray mb-6 leading-relaxed">
                After 12+ years as a personal trainer and nutritionist, I pivoted to IT in 2018.
                Since then I have focused on systems reliability, security, and scaling mission-critical operations.
              </p>
              <p className="text-lg text-light-gray mb-6 leading-relaxed">
                Joined GLAAD in September 2019 as a help desk technician and grew into Associate IT Director.
                When COVID-19 hit, I led a 72-hour migration from Windows Server 2008 to a cloud-native stack,
                keeping the organization fully remote.
              </p>
              <p className="text-lg text-light-gray mb-6 leading-relaxed">
                Built LuminOS, an internal AI application ecosystem with five production apps:
                a security dashboard, finance analytics, two media intelligence tools, and a macOS desktop app.
                Web apps run on Firebase/GCP; the desktop app uses server-side OAuth exchange via Firebase Functions.
              </p>
              <p className="text-lg text-light-gray mb-6 leading-relaxed">
                <strong className="text-pure-white">AI-augmented workflow:</strong> Each app has a dedicated AI persona mapped to its domain
                (Aegis for security, Astraea for finance, LUMOS for media, IRIS for Spectrum reporting, Turing for legal analysis).
                I treat AI as infrastructure, with strict auth, real data sources, caching, guardrails, and model fallbacks.
              </p>
              <p className="text-lg text-light-gray mb-6 leading-relaxed">
                <strong className="text-pure-white">AI build stack:</strong> Multi-terminal workflows with Codex, Claude Code, and Gemini CLI;
                IDEs like Cursor and Google Anti Gravity; MCP gateway servers via Docker for tool orchestration.
                I automate aggressively, but keep a security-first, human-in-the-loop posture across every pipeline.
              </p>
              <p className="text-lg text-light-gray mb-6 leading-relaxed">
                <strong className="text-pure-white">Systems mindset:</strong> My love of tech started in gaming and became discipline
                through bodybuilding. I was a competitive World of Warcraft raider and guild leader, building strategies
                before playbooks existed. That same focus on preparation, execution, and team coordination is how I run infrastructure today.
              </p>
              <p className="text-lg text-light-gray mb-6 leading-relaxed">
                <strong className="text-pure-white">Command center:</strong> Multi-system workspace tuned for parallel research,
                monitoring, and production, built to keep pace with AI-assisted workflows and executive response windows.
              </p>
              <div className="flex gap-4 flex-wrap">
                <span className="px-4 py-2 glass rounded-full text-sm">Cloud Migration</span>
                <span className="px-4 py-2 glass rounded-full text-sm">Zero Trust Security</span>
                <span className="px-4 py-2 glass rounded-full text-sm">Crisis Leadership</span>
                <span className="px-4 py-2 glass rounded-full text-sm">Digital Transformation</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-8 rounded-3xl"
            >
              <h3 className="text-2xl font-semibold mb-6 gradient-text">Journey</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-soft-gray">Started at GLAAD</span>
                  <span className="font-semibold">September 2019</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-soft-gray">Current Role</span>
                  <span className="font-semibold">Associate IT Director</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-soft-gray">Years in IT</span>
                  <span className="font-semibold">7 Years</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-soft-gray">Focus</span>
                  <span className="font-semibold">Security + Cloud + AI</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-soft-gray">AI Posture</span>
                  <span className="font-semibold">Augmented Delivery</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-soft-gray">Deployment</span>
                  <span className="font-semibold">Automated + Secure</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
