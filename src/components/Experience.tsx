import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px", amount: 0.15 })

  return (
    <div className="section-container py-20" ref={ref}>
      <div className="content-wrapper">
        <motion.h2
          className="text-section-title font-display mb-16 text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          The <span className="gradient-text">Transformation</span>
        </motion.h2>

        {/* Main Story */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div className="glass p-8 md:p-12 rounded-3xl bg-gradient-to-br from-sky-blue/20 to-teal/20">
            <div className="inline-block px-4 py-2 bg-gradient-blue rounded-full text-sm font-semibold mb-6">
              🚀 Associate IT Director • GLAAD • September 2019 - Present
            </div>

            <h3 className="text-3xl font-bold mb-6 gradient-text">
              72-Hour Emergency Cloud Transformation During COVID-19
            </h3>

            <p className="text-xl text-light-gray mb-6 leading-relaxed">
              Led an emergency transformation of GLAAD's IT infrastructure at the start of COVID-19,
              moving the organization from an aging on-prem environment to a cloud-native, remote-first
              architecture in under <span className="text-pure-white font-semibold">three days</span>.
            </p>

            <p className="text-lg text-light-gray leading-relaxed">
              <strong className="text-pure-white">GLAAD Media Awards (2019-Present):</strong> Provide IT infrastructure and security support for
              bi-annual flagship events in Los Angeles and New York City. In 2020, secured and delivered the first fully virtual broadcast,
              including streaming infrastructure and security controls under emergency conditions.
            </p>
          </div>
        </motion.div>

        {/* Legacy Environment Section */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div className="glass p-8 rounded-2xl border-l-4 border-red-500/50">
            <h4 className="text-2xl font-semibold mb-4 text-red-400">❌ Legacy Environment Decommissioned</h4>
            <p className="text-base text-light-gray mb-5 leading-relaxed">
              I was early in my IT career when the MSP was let go, and I was asked to take over a legacy stack
              and make it remote-ready in 72 hours. The organization had moved from Los Angeles to New York, but core systems
              never followed. When the pandemic hit, that gap became a single point of failure.
            </p>
            <ul className="space-y-3 text-light-gray">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span>End-of-life <strong className="text-pure-white">Windows Server 2008</strong> domain controller</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span>MSP-managed legacy stack with minimal modernization and limited internal visibility</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span>Users logging in with <strong className="text-pure-white">4-character passwords</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span>Hybrid on-prem <strong className="text-pure-white">Microsoft Exchange</strong> with severe storage limits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span><strong className="text-pure-white">No MDM</strong>; users on personal Apple IDs downloading random apps</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span>Had to carry a <strong className="text-pure-white">Dell laptop</strong> just to reset passwords on ancient AD</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span>Obsolete <strong className="text-pure-white">ShoreTel phone system</strong> (migrated to Verizon One Talk cloud VoIP after the remote shift)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span>LA-based file server left behind after HQ moved to NYC; site-to-site VPN made it feel local, but it wasn’t truly remote-ready</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span><strong className="text-pure-white">SonicWall firewalls</strong> were end-of-life, unpatched, and frequently crashed under remote load</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span>NetExtender VPN with shared credentials and no modern MFA for remote access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span>LA office sat empty; the file server had no verified backup or disaster recovery plan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">▸</span>
                <span>Fragile, location-dependent infrastructure unsuitable for distributed work</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Transformation Grid */}
        <div className="space-y-6 mb-12">
          {/* Top Row: Cloud & Remote (side by side) */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform"
            >
              <h4 className="text-xl font-semibold mb-4 gradient-text">☁️ Cloud & Identity</h4>
              <ul className="space-y-3 text-base text-light-gray">
                <li className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">✓</span>
                  <span>Retired on-prem AD; <strong className="text-pure-white">JumpCloud</strong> became primary identity with Workspace sync</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">✓</span>
                  <span>Retired hybrid Exchange and moved to <strong className="text-pure-white">Workspace Enterprise</strong> with “unlimited” storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">✓</span>
                  <span>Locked in nonprofit pricing (~$5/user) with Gemini access on a grandfathered tier</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">✓</span>
                  <span>Cloud-native IAM with modern auth and MFA</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">✓</span>
                  <span>Reduced VPN dependency for day-to-day access</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform"
            >
              <h4 className="text-xl font-semibold mb-4 gradient-text">🏠 Remote-First in 72 Hours</h4>
              <ul className="space-y-3 text-base text-light-gray">
                <li className="flex items-start gap-2">
                  <span className="text-baby-blue mt-1">✓</span>
                  <span>Entire staff remote-enabled in <strong className="text-pure-white">72 hours</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-baby-blue mt-1">✓</span>
                  <span>Location-independent workflows with U.S.-wide hiring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-baby-blue mt-1">✓</span>
                  <span>Cloud-based email, files, and collaboration</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Device Lifecycle & Dual Environment Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform"
            >
              <h4 className="text-xl font-semibold mb-4 gradient-text">💻 Device Lifecycle Automation</h4>
              <ul className="space-y-3 text-base text-light-gray">
                <li className="flex items-start gap-2">
                  <span className="text-baby-blue mt-1">✓</span>
                  <span><strong className="text-pure-white">One-click onboarding</strong> via Apple Business Manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-baby-blue mt-1">✓</span>
                  <span><strong className="text-pure-white">Zero-touch deployment</strong> (direct ship from Apple/Amazon)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-baby-blue mt-1">✓</span>
                <span>Managed Apple IDs with federated sign-in via <strong className="text-pure-white">Apple Business Manager + Google Workspace</strong></span>
                </li>
              <li className="flex items-start gap-2">
                <span className="text-baby-blue mt-1">✓</span>
                <span><strong className="text-pure-white">Automated offboarding</strong> with scheduled system lock</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-baby-blue mt-1">✓</span>
                <span>Apple Silicon standard with FileVault + MDM, using nonprofit hardware pricing</span>
              </li>
            </ul>
          </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform"
            >
              <h4 className="text-xl font-semibold mb-4 gradient-text">🔄 Dual Environment</h4>
              <ul className="space-y-3 text-base text-light-gray">
                <li className="flex items-start gap-2">
                  <span className="text-ocean-blue mt-1">✓</span>
                  <span><strong className="text-pure-white">Google Workspace</strong> primary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean-blue mt-1">✓</span>
                  <span><strong className="text-pure-white">Microsoft 365</strong> for finance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean-blue mt-1">✓</span>
                  <span>Secure rsync sync between Microsoft 365 and Google Workspace via a private AWS EC2 transfer host</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean-blue mt-1">✓</span>
                  <span><strong className="text-pure-white">Salesforce + NetSuite</strong></span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Security - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass p-8 rounded-2xl"
          >
            <h4 className="text-2xl font-semibold mb-6 gradient-text text-center">🔒 Enterprise Security (Nonprofit Budget)</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span><strong className="text-pure-white">JumpCloud + Jamf MDM</strong> for devices and personal phones</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span><strong className="text-pure-white">CrowdStrike</strong> endpoint + FileVault encryption</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span><strong className="text-pure-white">YubiKey-only MFA</strong> (7-day token reset)</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span><strong className="text-pure-white">Proofpoint</strong> email security</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span><strong className="text-pure-white">Dashlane Enterprise</strong> with SSO</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span>Layered backups: endpoint NAS, SaaS backups twice daily, encrypted offsite replication</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span>Conditional access with managed Chrome</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span>App allowlisting with ABM/Jamf deployment; no unapproved installs</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span>Redundant VPN endpoints with MFA</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span><strong className="text-pure-white">Nudge Security</strong> for OAuth governance and AI tool DLP visibility</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span><strong className="text-pure-white">AWS + CloudFront + WAF</strong></span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span>GLAAD-managed laptops required</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span><strong className="text-pure-white">Zero-day patching</strong> for critical issues</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span>Monthly pen tests</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-teal mt-1">✓</span>
                <span><strong className="text-pure-white">Diffract</strong> custom-built cyber dashboard</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="glass border border-emerald-400/40 bg-emerald-500/10 px-5 py-3 rounded-full text-sm text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                SecurityScorecard average <strong className="text-emerald-100">98/100</strong> over 5 years
              </div>
              <p className="text-xs text-soft-gray">
                Current score: 91; CSP remediation in progress
              </p>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6">
              <h5 className="text-lg font-semibold mb-4 text-center text-pure-white">GLAAD.org Platform</h5>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-base text-light-gray">
                <div className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">▹</span>
                  <span>AWS Route 53 DNS + CloudFront CDN/WAF front door</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">▹</span>
                  <span>Segmented EC2 tiers behind load balancing</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">▹</span>
                  <span>Publishing locked behind VPN + MFA; admin access restricted</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">▹</span>
                  <span>Tableau dashboards tracking anti-LGBTQ hate and hate crime trends</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">▹</span>
                  <span>Gravity Forms protected with OpenAI-based submission scanning</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">▹</span>
                  <span>Bynder DAM hosts site assets behind SSO (@glaad.org only)</span>
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6">
              <h5 className="text-lg font-semibold mb-4 text-center text-pure-white">Hybrid Office Infrastructure</h5>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-base text-light-gray">
                <div className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">▹</span>
                  <span>Next-gen Ubiquiti network stack with segmented office and production networks</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">▹</span>
                  <span>Dual-WAN connectivity with automatic failover and warm-standby resiliency</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">▹</span>
                  <span>10GbE backbone for creative/media workflows and large asset transfers</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">▹</span>
                  <span>SSO-backed RADIUS Wi-Fi tied to JumpCloud (Wi-Fi 7-ready)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sky-blue mt-1">▹</span>
                  <span>Verkada physical security integrated with JumpCloud access governance</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LuminOS Ecosystem - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass p-6 rounded-2xl"
          >
            <h4 className="text-xl font-semibold mb-3 gradient-text text-center">🤖 LuminOS: Internal AI Application Ecosystem</h4>
            <p className="text-center text-base text-light-gray mb-4">
              AI-native toolset with domain-specific assistants (Aegis, Astraea, LUMOS, IRIS, Turing) for security, finance, media intelligence, and legal analysis.
              The naming system mirrors how light reveals truth; each product bends or separates signal to surface insight.
            </p>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 mb-4">
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-aqua mt-1">✓</span>
                <span><strong className="text-pure-white">Diffract</strong>: Executive security dashboard</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-aqua mt-1">✓</span>
                <span><strong className="text-pure-white">Refract</strong>: Salesforce + NetSuite analytics</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-aqua mt-1">✓</span>
                <span><strong className="text-pure-white">Prism</strong>: Media monitoring & tracking</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-aqua mt-1">✓</span>
                <span><strong className="text-pure-white">Spectrum</strong>: Media scoping & analysis</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-aqua mt-1">✓</span>
                <span><strong className="text-pure-white">NetRunner</strong>: Desktop legal analysis tool</span>
              </div>
              <div className="flex items-start gap-2 text-base text-light-gray">
                <span className="text-aqua mt-1">✓</span>
                <span>AI personas: <strong className="text-pure-white">Aegis, Astraea, LUMOS, IRIS, Turing</strong></span>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-sm text-center text-soft-gray mb-3">
                <strong className="text-pure-white">Security-First Infrastructure:</strong>
              </p>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-light-gray">
                <div className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">▹</span>
                  <span>Web apps hosted on <strong className="text-pure-white">Firebase Hosting + GCP Functions</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">▹</span>
                  <span>Secrets stored in <strong className="text-pure-white">Firebase Secret Manager</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">▹</span>
                  <span>Server-side OAuth token exchange (no client secrets in desktop app)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">▹</span>
                  <span>Firebase Auth enforcement with domain/allowlist controls</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">▹</span>
                  <span>JumpCloud SSO with org-wide MFA across internal apps</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">▹</span>
                  <span>Enterprise tooling administration (Asana, dashboards, and access governance)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team & Resources */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <div className="inline-block glass p-6 rounded-2xl border-2 border-sky-blue/30">
            <p className="text-xl md:text-2xl font-semibold mb-2">
              <span className="gradient-text">Lean IT Team, Hands-On Leadership</span>
            </p>
            <p className="text-sm text-light-gray">
              Led architecture and delivery end-to-end, with day-to-day support handled by a junior technician.
              I also support creative and media production workflows for high-visibility events.
            </p>
          </div>
        </motion.div>

        {/* Outcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass p-8 md:p-12 rounded-3xl bg-gradient-to-br from-green-500/20 to-sky-blue/20"
        >
          <h4 className="text-2xl font-semibold mb-6 text-green-400">✨ Outcome</h4>
          <div className="grid md:grid-cols-2 gap-6 text-light-gray">
            <div>
              <p className="mb-3">
                ✓ <strong className="text-pure-white">Cloud-native, SaaS-first</strong> IT environment
              </p>
              <p className="mb-3">
                ✓ Organization became <strong className="text-pure-white">location-independent within 72 hours</strong>
              </p>
              <p className="mb-3">
                ✓ Dramatically increased <strong className="text-pure-white">reliability, security, and scalability</strong>
              </p>
              <p className="mb-3">
                ✓ <strong className="text-pure-white">Enterprise-grade security</strong> on nonprofit budget
              </p>
            </div>
            <div>
              <p className="mb-3">
                ✓ Enabled <strong className="text-pure-white">distributed operations</strong> with modern hiring practices
              </p>
              <p className="mb-3">
                ✓ Standardized <strong className="text-pure-white">device lifecycle and identity</strong> management
              </p>
              <p className="mb-3">
                ✓ <strong className="text-pure-white">Sub-minute response</strong> for critical issues with prevention-first operations
              </p>
              <p className="mb-3">
                ✓ Automated and maintained <strong className="text-pure-white">org-wide workflows</strong> across IT and security
              </p>
              <p className="mb-3">
                ✓ <strong className="text-pure-white">Zero-trust-aligned architecture</strong> with monthly penetration test validation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <h4 className="text-xl font-semibold mb-8">Career Progression</h4>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            {[
              { year: 'Sept 2019', role: 'Help Desk Technician', accent: 'text-sky-blue' },
              { year: '2020', role: 'IT Specialist', accent: 'text-baby-blue' },
              { year: '2022', role: 'IT Manager', accent: 'text-aqua' },
              { year: 'Present', role: 'Associate IT Director', accent: 'text-teal', highlight: true },
            ].map((item, index) => (
              <div key={item.year} className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.6, once: false, margin: '0px 0px -15% 0px' }}
                  transition={{ duration: 0.55, delay: 0.12 + index * 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className={`glass px-7 py-3 rounded-full border border-white/25 shadow-[0_0_25px_rgba(56,189,248,0.18)] ${
                    item.highlight ? 'bg-space-black/60' : 'bg-space-black/50'
                  }`}
                >
                  <span className="text-pure-white text-sm">{item.year}</span>
                  <p className={`font-semibold ${item.highlight ? 'gradient-text' : 'text-pure-white'}`}>{item.role}</p>
                </motion.div>

                {index < 3 && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ amount: 0.6, once: false, margin: '0px 0px -15% 0px' }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.18, ease: [0.22, 1, 0.36, 1] }}
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
