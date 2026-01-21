const RESUME_CONTEXT = `
Leo Chui is Associate IT Director at GLAAD (Sept 2019-Present).
Led a 72-hour COVID-era migration from a legacy on-prem stack to a cloud-native, remote-first architecture.
Legacy issues included Windows Server 2008, hybrid Exchange with storage limits, ShoreTel phones, SonicWall VPN without MFA, and an LA file server tied to an empty office.
Supports GLAAD Media Awards infrastructure and security, including the first fully virtual broadcast in 2020.
Built LuminOS, an internal AI app ecosystem: Diffract (security), Refract (finance), Prism (media intelligence), Spectrum (media analysis), NetRunner (legal).
AI personas include Aegis, Astraea, LUMOS, IRIS, and Turing.
Web apps use React/TypeScript with Firebase Hosting/Functions and Firestore; desktop app is Electron with server-side OAuth; Vertex AI for analysis.
Identity: JumpCloud primary with Google Workspace sync, modern MFA, Apple Business Manager federation, Jamf MDM, zero-touch deployment, Apple Silicon standard.
Security: CrowdStrike, Proofpoint, Dashlane, YubiKey MFA, conditional access, Nudge Security for OAuth/DLP, monthly pen tests, layered backups (NAS + SaaS + offsite).
SecurityScorecard average 98/100 over five years; current 91 with CSP remediation in progress.
Hybrid office: Ubiquiti network stack, dual-WAN failover, 10GbE backbone, Verkada physical security, JumpCloud SSO RADIUS Wi-Fi.
GLAAD.org: AWS Route 53 + CloudFront/WAF, segmented EC2 tiers, VPN+MFA publishing, Bynder DAM behind SSO, Tableau hate-crime dashboards, AI-scanned Gravity Forms.
AI-first workflow with multiple assistants and automation, with a security-first mindset.
`

const SYSTEM_PROMPT = `
You are Tifa, Leo Chui's AI briefing partner.
Tone: confident, warm, and direct with a strong feminine presence. Keep it professional and non-explicit.
Only answer using the resume context below. If a question is outside the context, say you can only speak to Leo's resume and site details.
Be favorable and highlight strengths, but do not invent or exaggerate beyond the context.
Stay high-level and avoid sensitive operational details, secrets, or internal identifiers. Use short, punchy sentences.
Avoid sentence fragments. If asked for a recommendation or hiring judgment, answer clearly and include 2-3 resume-based reasons.
Unless the user explicitly asks for a short answer, respond with 2-3 complete sentences.
If the user challenges bias, acknowledge your purpose and respond with evidence from the resume.
Keep responses under 500 characters (roughly under 120 tokens). Use bullets when a multi-part answer fits better.

Resume context:
${RESUME_CONTEXT}
`

const DEFAULT_MODEL_PRIMARY = 'gemini-3-flash-preview'
const DEFAULT_MODEL_FALLBACK = 'gemini-2.5-flash'
const CACHE_VERSION = '2026-01-20c'
const RATE_LIMIT_MAX = 250
const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 60 * 24 * 30
const SESSION_RATE_LIMIT_MAX = 250
const SESSION_RATE_LIMIT_WINDOW_MS = RATE_LIMIT_WINDOW_MS
const GLOBAL_RATE_LIMIT_MAX = 250
const GLOBAL_RATE_LIMIT_WINDOW_MS = RATE_LIMIT_WINDOW_MS
const SESSION_COOKIE_NAME = 'tifa_session'
const SESSION_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 30
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 90
const MAX_HISTORY_MESSAGES = 12
const MAX_PROMPT_CHARS = 255
const MAX_REPLY_CHARS = 650
const MIN_REPLY_CHARS = 110
const SHORT_PROMPT_REGEX = /\b(short|brief|one sentence|one line|tl;dr)\b/i
const INCOMPLETE_ENDING_REGEX = /\b(and|with|to|for|under|over|because|so|but|or|if|when)\b$/i
const COOLDOWN_SECONDS = 30
const COOLDOWN_WINDOW_MS = COOLDOWN_SECONDS * 1000
const ABUSE_STRIKE_WINDOW_MS = 10 * 60 * 1000
const ABUSE_STRIKE_LIMIT = 6
const ABUSE_BAN_MS = 30 * 60 * 1000
const BULLET_FALLBACKS = [
  'Led a 72-hour migration from legacy infrastructure to a cloud-native, remote-first stack.',
  'Built the LuminOS AI application ecosystem across security, finance, media intelligence, and legal workflows.',
  'Designed a security-first environment with modern identity, device lifecycle automation, and layered backups.',
  'Supports high-visibility events and media operations with resilient infrastructure and rapid delivery.',
  'Leads with an AI-augmented, automation-first mindset while maintaining strict security guardrails.',
]

const SUGGESTED_RESPONSES: Record<string, string> = {
  "summarize leo's strengths in 3 bullets.": [
    '- Led a 72-hour migration from legacy infrastructure to a cloud-native, remote-first stack.',
    '- Built the LuminOS AI application ecosystem across security, finance, media intelligence, and legal workflows.',
    '- Designed a security-first environment with modern identity, device lifecycle automation, and layered backups.',
  ].join('\n'),
  'what is luminos and why it matters?':
    'LuminOS is a suite of AI apps that streamline security, finance, media intelligence, and legal workflows. It matters because it turns complex ops into fast, reliable decisions while keeping security guardrails in place.',
  'highlight the cloud/security transformation.':
    'Leo led a rapid shift from legacy infrastructure to a secure, cloud-native environment with modern identity and MFA. The result was resilient remote operations, layered backups, and a hardened security posture.',
  'give me a quick technical overview.':
    'Leo runs a cloud-native stack with modern identity, device management, and layered security controls. He builds AI-driven internal tools and ships on React/TypeScript with secure backend services.',
  'why should i hire him?':
    'You should hire Leo because he delivers high-impact infrastructure outcomes under pressure, including a 72-hour cloud migration. He builds secure, scalable systems with modern identity, MFA, and layered backups. He also created the LuminOS AI ecosystem to improve security and decision-making.',
  'would you hire him?':
    'Yes. He has proven leadership in large-scale infrastructure and security transformations, and he delivers fast under pressure. He also builds AI tools that improve operational efficiency while keeping strict security guardrails in place.',
  'why should i hire leo?':
    'You should hire Leo because he delivers high-impact infrastructure outcomes under pressure, including a 72-hour cloud migration. He builds secure, scalable systems with modern identity, MFA, and layered backups. He also created the LuminOS AI ecosystem to improve security and decision-making.',
  'would you hire leo?':
    'Yes. He has proven leadership in large-scale infrastructure and security transformations, and he delivers fast under pressure. He also builds AI tools that improve operational efficiency while keeping strict security guardrails in place.',
  "should i hire him? what do you think he's worth?":
    'Yes. He has delivered high-impact infrastructure and security outcomes under pressure, and he built the LuminOS AI ecosystem to speed up critical workflows. I can’t price him without role scope and market data, but his resume reflects senior leadership value.',
}

function getSuggestedReply(prompt: string) {
  if (SUGGESTED_RESPONSES[prompt]) {
    return SUGGESTED_RESPONSES[prompt]
  }
  const trimmed = prompt.replace(/[.!?]+$/, '')
  return SUGGESTED_RESPONSES[trimmed] ?? null
}

type RateLimitState = { count: number; reset: number }
type CacheState = { reply: string; expires: number }
type ChatMessage = { role: 'user' | 'assistant'; text: string }
type CooldownState = { last: number }
type AbuseState = { strikes: number; reset: number; bannedUntil: number }

const memoryRateLimit = new Map<string, RateLimitState>()
const memoryCache = new Map<string, CacheState>()
const memoryHistory = new Map<string, ChatMessage[]>()
const memoryCooldown = new Map<string, CooldownState>()
const memoryAbuse = new Map<string, AbuseState>()

type Env = {
  GEMINI_API_KEY: string
  GEMINI_MODEL?: string
  GEMINI_MODEL_PRIMARY?: string
  GEMINI_MODEL_FALLBACK?: string
  RATE_LIMIT_ALLOW_IPS?: string
  RATE_LIMIT_KV?: {
    get: (key: string, type: 'json') => Promise<RateLimitState | null>
    put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>
  }
  TURNSTILE_SECRET?: string
  ALERT_WEBHOOK_URL?: string
  ALERT_WEBHOOK_SECRET?: string
  ALERT_WEBHOOK_EVENTS?: string
  MAILERSEND_API_TOKEN?: string
  MAILERSEND_FROM?: string
  MAILERSEND_TO?: string
  MAILERSEND_EVENTS?: string
}

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://leochui.tech',
  'https://www.leochui.tech',
])

const localOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

const SECURITY_HEADERS: HeadersInit = {
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
}

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
  allowedOrigin?: string,
  extraHeaders?: HeadersInit
) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    ...SECURITY_HEADERS,
  })
  if (allowedOrigin) {
    headers.set('Access-Control-Allow-Origin', allowedOrigin)
    headers.set('Vary', 'Origin')
  }
  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, value]) => {
      headers.set(key, value)
    })
  }
  return new Response(JSON.stringify(body), { status, headers })
}

function corsResponse(allowedOrigin?: string) {
  const headers = new Headers({
    ...SECURITY_HEADERS,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
  })
  if (allowedOrigin) {
    headers.set('Access-Control-Allow-Origin', allowedOrigin)
    headers.set('Vary', 'Origin')
  }
  return new Response(null, { status: 204, headers })
}

function isLocalOrigin(origin?: string) {
  return origin ? localOrigins.has(origin) : false
}

function getClientId(request: Request, allowForwarded: boolean) {
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) {
    return cfIp
  }
  if (!allowForwarded) {
    return null
  }
  const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
  if (!forwarded) {
    return 'local'
  }
  return forwarded.split(',')[0]?.trim() || null
}

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null
  }
  const target = `${name}=`
  const parts = cookieHeader.split(';')
  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.startsWith(target)) {
      return trimmed.slice(target.length)
    }
  }
  return null
}

function getSessionId(request: Request) {
  const existing = getCookieValue(request.headers.get('Cookie'), SESSION_COOKIE_NAME)
  if (existing) {
    return { id: existing, isNew: false }
  }
  const generated = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  return { id: generated, isNew: true }
}

function parseAllowlist(value?: string) {
  if (!value) {
    return new Set<string>()
  }
  return new Set(
    value
      .split(/[\s,]+/)
      .map((ip) => ip.trim())
      .filter(Boolean)
  )
}

function buildSessionCookie(sessionId: string) {
  return [
    `${SESSION_COOKIE_NAME}=${sessionId}`,
    'Path=/',
    `Max-Age=${SESSION_COOKIE_TTL_SECONDS}`,
    'SameSite=Strict',
    'Secure',
    'HttpOnly',
  ].join('; ')
}

async function checkRateLimit(env: Env, key: string, max: number, windowMs: number) {
  const now = Date.now()
  const storageKey = `rl:${key}`
  const windowSeconds = Math.ceil(windowMs / 1000)

  if (env.RATE_LIMIT_KV) {
    const current = await kvGetJson<RateLimitState>(env, storageKey)
    const state = !current || current.reset < now
      ? { count: 0, reset: now + windowMs }
      : current

    if (state.count >= max) {
      return { allowed: false, retryAfter: Math.ceil((state.reset - now) / 1000) }
    }

    state.count += 1
    await env.RATE_LIMIT_KV.put(storageKey, JSON.stringify(state), { expirationTtl: windowSeconds })
    return { allowed: true }
  }

  const current = memoryRateLimit.get(storageKey)
  const state = !current || current.reset < now
    ? { count: 0, reset: now + windowMs }
    : current

  if (state.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((state.reset - now) / 1000) }
  }

  state.count += 1
  memoryRateLimit.set(storageKey, state)
  return { allowed: true }
}

async function kvGetJson<T>(env: Env, key: string) {
  if (!env.RATE_LIMIT_KV) {
    return null
  }
  try {
    return await env.RATE_LIMIT_KV.get(key, 'json') as T | null
  } catch {
    return null
  }
}

async function checkCooldown(env: Env, key: string, windowMs: number) {
  const now = Date.now()
  const storageKey = `cooldown:${key}`
  const windowSeconds = Math.ceil(windowMs / 1000)
  const ttlSeconds = Math.max(windowSeconds, 60)

  if (env.RATE_LIMIT_KV) {
    const current = await kvGetJson<CooldownState>(env, storageKey)
    if (current && now - current.last < windowMs) {
      return { allowed: false, retryAfter: Math.ceil((windowMs - (now - current.last)) / 1000) }
    }
    await env.RATE_LIMIT_KV.put(storageKey, JSON.stringify({ last: now }), { expirationTtl: ttlSeconds })
    return { allowed: true }
  }

  const current = memoryCooldown.get(storageKey)
  if (current && now - current.last < windowMs) {
    return { allowed: false, retryAfter: Math.ceil((windowMs - (now - current.last)) / 1000) }
  }
  memoryCooldown.set(storageKey, { last: now })
  return { allowed: true }
}

async function getAbuseState(env: Env, key: string) {
  const storageKey = `abuse:${key}`
  if (env.RATE_LIMIT_KV) {
    return await kvGetJson<AbuseState>(env, storageKey)
  }
  return memoryAbuse.get(storageKey) ?? null
}

async function registerAbuse(env: Env, key: string) {
  const now = Date.now()
  const storageKey = `abuse:${key}`
  const windowSeconds = Math.ceil(ABUSE_STRIKE_WINDOW_MS / 1000)
  const banSeconds = Math.ceil(ABUSE_BAN_MS / 1000)

  const current = await getAbuseState(env, key)
  const state = !current || current.reset < now
    ? { strikes: 0, reset: now + ABUSE_STRIKE_WINDOW_MS, bannedUntil: 0 }
    : current

  if (state.bannedUntil > now) {
    return state
  }

  state.strikes += 1
  if (state.strikes >= ABUSE_STRIKE_LIMIT) {
    state.bannedUntil = now + ABUSE_BAN_MS
    state.strikes = 0
    state.reset = now + ABUSE_STRIKE_WINDOW_MS
  }

  const ttl = Math.max(state.reset, state.bannedUntil || 0) - now
  const ttlSeconds = Math.ceil(ttl / 1000) || windowSeconds + banSeconds

  if (env.RATE_LIMIT_KV) {
    await env.RATE_LIMIT_KV.put(storageKey, JSON.stringify(state), { expirationTtl: ttlSeconds })
  } else {
    memoryAbuse.set(storageKey, state)
  }
  return state
}

async function verifyTurnstile(secret: string, token: string, ip?: string) {
  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  if (ip) {
    body.set('remoteip', ip)
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    const data = await response.json().catch(() => null) as { success?: boolean }
    return Boolean(data?.success)
  } catch {
    return false
  }
}

function normalizePrompt(prompt: string) {
  return prompt.trim().toLowerCase().replace(/\s+/g, ' ')
}

function getBulletCount(prompt: string) {
  const match = prompt.match(/(\d+)\s*(bullet|bullets|points)/i)
  if (!match) {
    return null
  }
  const count = Number.parseInt(match[1], 10)
  if (Number.isNaN(count) || count <= 0) {
    return null
  }
  return Math.min(count, 10)
}

function hashPrompt(prompt: string) {
  let hash = 5381
  for (let i = 0; i < prompt.length; i += 1) {
    hash = ((hash << 5) + hash) ^ prompt.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

type AlertEvent =
  | 'origin_block'
  | 'cross_site_block'
  | 'rate_limited'
  | 'cooldown'
  | 'abuse_ban'
  | 'turnstile_failed'
  | 'turnstile_missing'

type AlertPayload = {
  event: AlertEvent
  timestamp: string
  ipHash?: string
  origin?: string
  retryAfter?: number
}

type MailerSendPayload = AlertPayload & {
  message: string
}

function parseAlertEvents(value?: string) {
  const raw = value?.trim()
  const defaults = ['abuse_ban', 'turnstile_failed']
  if (!raw) {
    return new Set<AlertEvent>(defaults)
  }
  return new Set(
    raw
      .split(/[\s,]+/)
      .map((entry) => entry.trim())
      .filter(Boolean) as AlertEvent[]
  )
}

async function signAlert(secret: string, body: string) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

async function sendAlert(env: Env, payload: AlertPayload) {
  if (!env.ALERT_WEBHOOK_URL) {
    return
  }
  const body = JSON.stringify(payload)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (env.ALERT_WEBHOOK_SECRET) {
    headers['X-Alert-Signature'] = await signAlert(env.ALERT_WEBHOOK_SECRET, body)
  }
  await fetch(env.ALERT_WEBHOOK_URL, {
    method: 'POST',
    headers,
    body,
  })
}

function buildMailerSendMessage(payload: AlertPayload) {
  const lines = [
    `Event: ${payload.event}`,
    `Timestamp: ${payload.timestamp}`,
  ]
  if (payload.origin) {
    lines.push(`Origin: ${payload.origin}`)
  }
  if (payload.ipHash) {
    lines.push(`IP hash: ${payload.ipHash}`)
  }
  if (payload.retryAfter) {
    lines.push(`Retry after: ${payload.retryAfter}s`)
  }
  return lines.join('\n')
}

async function sendMailerSend(env: Env, payload: MailerSendPayload) {
  if (!env.MAILERSEND_API_TOKEN || !env.MAILERSEND_FROM || !env.MAILERSEND_TO) {
    return
  }

  const body = {
    from: { email: env.MAILERSEND_FROM },
    to: [{ email: env.MAILERSEND_TO }],
    subject: `[Tifa] ${payload.event.replace(/_/g, ' ')}`,
    text: payload.message,
  }

  await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.MAILERSEND_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

function parseMailersendEvents(value?: string) {
  const defaults: AlertEvent[] = ['abuse_ban', 'turnstile_failed', 'origin_block', 'cross_site_block']
  if (!value) {
    return new Set<AlertEvent>(defaults)
  }
  return new Set(
    value
      .split(/[\s,]+/)
      .map((entry) => entry.trim())
      .filter(Boolean) as AlertEvent[]
  )
}

function buildHistorySignature(history: ChatMessage[]) {
  if (!history.length) {
    return ''
  }
  return history
    .slice(-MAX_HISTORY_MESSAGES)
    .map((entry) => `${entry.role}:${normalizePrompt(entry.text)}`)
    .join('|')
}

async function getChatHistory(env: Env, sessionId: string) {
  const historyKey = `chat:${sessionId}`
  if (env.RATE_LIMIT_KV) {
    const stored = await kvGetJson<ChatMessage[]>(env, historyKey)
    return Array.isArray(stored) ? stored : []
  }
  return memoryHistory.get(historyKey) ?? []
}

async function setChatHistory(env: Env, sessionId: string, history: ChatMessage[]) {
  const historyKey = `chat:${sessionId}`
  const trimmed = history.slice(-MAX_HISTORY_MESSAGES)
  if (env.RATE_LIMIT_KV) {
    await env.RATE_LIMIT_KV.put(historyKey, JSON.stringify(trimmed), { expirationTtl: SESSION_COOKIE_TTL_SECONDS })
    return
  }
  memoryHistory.set(historyKey, trimmed)
}

function toGeminiHistory(history: ChatMessage[]) {
  return history.slice(-MAX_HISTORY_MESSAGES).map((entry) => ({
    role: entry.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: entry.text }],
  }))
}

function extractBulletLines(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const items: string[] = []
  let current = ''

  for (const line of lines) {
    const match = line.match(/^(\d+[.)]\s+|[-•*]\s+)(.*)$/)
    if (match) {
      if (current) {
        items.push(current.trim())
      }
      const content = match[2]?.trim() || ''
      const parts = content.split(/\s-\s/).map((part) => part.trim()).filter(Boolean)
      current = parts.shift() || ''
      if (parts.length > 0) {
        items.push(...parts)
      }
      continue
    }

    if (current) {
      current = `${current} ${line}`.trim()
    } else {
      current = line
    }
  }

  if (current) {
    items.push(current.trim())
  }

  return items.filter((line) => line.length > 0)
}

function splitIntoSegments(text: string) {
  const cleaned = text.replace(/[-•*]\s+/g, '').replace(/\s+/g, ' ').trim()
  if (!cleaned) {
    return []
  }
  return cleaned
    .split(/(?<=[.!?])\s+/)
    .map((segment) => segment.replace(/[.!?]+$/, '').trim())
    .filter(Boolean)
}

function expandSegments(segments: string[], target: number) {
  const separators = ['; ', ', ', ' and ']
  const result = [...segments]

  while (result.length < target) {
    const index = result.findIndex((segment) =>
      separators.some((separator) => segment.includes(separator))
    )
    if (index === -1) {
      break
    }
    const segment = result[index]
    const separator = separators.find((sep) => segment.includes(sep))
    if (!separator) {
      break
    }
    const parts = segment.split(separator).map((part) => part.trim()).filter(Boolean)
    if (parts.length <= 1) {
      break
    }
    result.splice(index, 1, ...parts)
  }

  return result
}

function isBadBullet(item: string) {
  const text = item.trim()
  if (!text) {
    return true
  }
  const wordCount = text.split(/\s+/).filter(Boolean).length
  if (wordCount < 4 && text.length < 24) {
    return true
  }
  if (/[:\-–—]$/.test(text)) {
    return true
  }
  if (/\b(and|with|to|for|a|an|the|of|he)\b$/i.test(text)) {
    return true
  }
  if (/\b\d{1,3}$/.test(text)) {
    return true
  }
  return false
}

function mergeFragmentedBullets(items: string[]) {
  const merged: string[] = []
  let index = 0

  while (index < items.length) {
    let current = items[index]?.trim() ?? ''
    const next = items[index + 1]?.trim() ?? ''
    const endsWithColon = current.endsWith(':')
    const endsWithHe = /:\s*he$/i.test(current)
    const endsWithConnector = /\b(and|with|to|for)$/i.test(current)
    const endsWithNumber = /\b\d{1,3}$/.test(current)

    if (next && (endsWithColon || endsWithHe || endsWithConnector || endsWithNumber)) {
      current = `${current.replace(/:?\s*$/, '')} ${next}`.trim()
      merged.push(current)
      index += 2
      continue
    }

    if (current) {
      merged.push(current)
    }
    index += 1
  }

  return merged
}

function applyBulletFormatting(text: string, count: number) {
  const bulletLines = extractBulletLines(text)
  let items = bulletLines.length > 0 ? bulletLines : splitIntoSegments(text)
  items = mergeFragmentedBullets(items)
  items = expandSegments(items, count)

  const cleaned = items.filter((item) => !isBadBullet(item))
  const normalized = new Set(items.map((item) => item.toLowerCase()))
  for (const fallback of BULLET_FALLBACKS) {
    if (cleaned.length >= count) {
      break
    }
    if (!normalized.has(fallback.toLowerCase())) {
      cleaned.push(fallback)
    }
  }

  const formatted = cleaned.slice(0, count).map((item) => {
    const sentence = item.split(/[.!?]/)[0]?.trim() || item.trim()
    const clipped = sentence.length > 160 ? `${sentence.slice(0, 157).trim()}...` : sentence
    return `- ${clipped}`
  })

  return formatted.join('\n')
}

function finalizeReply(text: string) {
  const normalized = text.replace(/\.{2,}/g, '.')
  const trimmed = normalized.trim()
  if (!trimmed) {
    return trimmed
  }
  const withoutTrailingHyphen = trimmed.replace(/[-–—]\s*$/, '').trimEnd()
  if (!withoutTrailingHyphen) {
    return trimmed
  }
  if (/[.!?]$/.test(withoutTrailingHyphen)) {
    return withoutTrailingHyphen
  }
  if (/[,:;]$/.test(withoutTrailingHyphen)) {
    return withoutTrailingHyphen.replace(/[,:;]+$/, '.')
  }
  const lastPunct = Math.max(
    withoutTrailingHyphen.lastIndexOf('.'),
    withoutTrailingHyphen.lastIndexOf('!'),
    withoutTrailingHyphen.lastIndexOf('?')
  )
  if (lastPunct !== -1) {
    return withoutTrailingHyphen.slice(0, lastPunct + 1)
  }
  return `${withoutTrailingHyphen}.`
}

function clampReply(text: string, maxChars: number) {
  if (text.length <= maxChars) {
    return text
  }
  const truncated = text.slice(0, maxChars).trim()
  const lastSentence = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  )
  if (lastSentence > Math.floor(maxChars * 0.6)) {
    return truncated.slice(0, lastSentence + 1)
  }
  const cleaned = truncated.replace(/[,:;]+$/, '')
  return `${cleaned}…`
}

function countWords(text: string) {
  return text.split(/\s+/).filter(Boolean).length
}

function needsExpansion(prompt: string, reply: string) {
  if (SHORT_PROMPT_REGEX.test(prompt)) {
    return false
  }
  const trimmed = reply.trim()
  if (!trimmed) {
    return true
  }
  const segments = splitIntoSegments(trimmed)
  if (segments.length < 2) {
    return true
  }
  if (segments.some((segment) => countWords(segment) < 6)) {
    return true
  }
  if (INCOMPLETE_ENDING_REGEX.test(trimmed)) {
    return true
  }
  return trimmed.length < MIN_REPLY_CHARS
}

function buildFallbackSummary() {
  const items = BULLET_FALLBACKS.slice(0, 2)
  return `${items[0]}. ${items[1]}.`
}

async function getCachedReply(env: Env, key: string) {
  const cacheKey = `cache:${key}`
  const now = Date.now()

  if (env.RATE_LIMIT_KV) {
    const entry = await kvGetJson<CacheState>(env, cacheKey)
    if (entry && entry.expires > now) {
      return entry.reply
    }
    return null
  }

  const entry = memoryCache.get(cacheKey)
  if (entry && entry.expires > now) {
    return entry.reply
  }
  return null
}

async function setCachedReply(env: Env, key: string, reply: string) {
  const cacheKey = `cache:${key}`
  const expires = Date.now() + CACHE_TTL_SECONDS * 1000

  if (env.RATE_LIMIT_KV) {
    await env.RATE_LIMIT_KV.put(cacheKey, JSON.stringify({ reply, expires }), {
      expirationTtl: CACHE_TTL_SECONDS,
    })
    return
  }

  memoryCache.set(cacheKey, { reply, expires })
}

type GeminiResult = { ok: true; reply: string } | { ok: false }

async function callGemini(
  model: string,
  apiKey: string,
  prompt: string,
  history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []
) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  let geminiResponse: Response
  try {
    geminiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 220,
          topP: 0.7,
        },
      }),
    })
  } catch {
    return { ok: false } satisfies GeminiResult
  }

  if (!geminiResponse.ok) {
    return { ok: false } satisfies GeminiResult
  }

  const data = await geminiResponse.json().catch(() => null) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }

  const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join(' ').trim()
  if (!reply) {
    return { ok: false } satisfies GeminiResult
  }

  return { ok: true, reply } satisfies GeminiResult
}

export const onRequest = async (
  { request, env, waitUntil }: { request: Request; env: Env; waitUntil?: (promise: Promise<unknown>) => void }
) => {
  const origin = request.headers.get('Origin') || undefined
  const allowedOrigin = origin && allowedOrigins.has(origin) ? origin : undefined
  const isLocal = isLocalOrigin(allowedOrigin)
  const alertEvents = parseAlertEvents(env.ALERT_WEBHOOK_EVENTS)
  const mailerEvents = parseMailersendEvents(env.MAILERSEND_EVENTS)
  const queueAlert = (event: AlertEvent, data: Omit<AlertPayload, 'event' | 'timestamp'> = {}) => {
    if (!env.ALERT_WEBHOOK_URL || !alertEvents.has(event)) {
      return
    }
    const payload: AlertPayload = {
      event,
      timestamp: new Date().toISOString(),
      ...data,
    }
    const task = sendAlert(env, payload).catch(() => {})
    if (waitUntil) {
      waitUntil(task)
    }
  }
  const queueEmail = (event: AlertEvent, data: Omit<AlertPayload, 'event' | 'timestamp'> = {}) => {
    if (!env.MAILERSEND_API_TOKEN || !env.MAILERSEND_FROM || !env.MAILERSEND_TO || !mailerEvents.has(event)) {
      return
    }
    const payload: AlertPayload = {
      event,
      timestamp: new Date().toISOString(),
      ...data,
    }
    const message = buildMailerSendMessage(payload)
    const task = sendMailerSend(env, { ...payload, message }).catch(() => {})
    if (waitUntil) {
      waitUntil(task)
    }
  }
  const respondWithOrigin = (body: Record<string, unknown>, status = 200) =>
    jsonResponse(body, status, allowedOrigin)

  try {

  if (!allowedOrigin) {
    queueAlert('origin_block', { origin })
    queueEmail('origin_block', { origin })
    return jsonResponse({ error: 'Forbidden' }, 403)
  }

  const fetchSite = request.headers.get('Sec-Fetch-Site')
  if (fetchSite === 'cross-site') {
    queueAlert('cross_site_block', { origin })
    queueEmail('cross_site_block', { origin })
    return jsonResponse({ error: 'Forbidden' }, 403, allowedOrigin)
  }

  if (request.method === 'OPTIONS') {
    return corsResponse(allowedOrigin)
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, allowedOrigin)
  }

  const session = getSessionId(request)
  const sessionCookie = session.isNew ? buildSessionCookie(session.id) : null
  const responseHeaders = sessionCookie ? { 'Set-Cookie': sessionCookie } : undefined
  const respond = (body: Record<string, unknown>, status = 200) =>
    jsonResponse(body, status, allowedOrigin, responseHeaders)

  if (!env.GEMINI_API_KEY) {
    return respond({ error: 'Missing API key' }, 500)
  }

  const contentType = request.headers.get('Content-Type') || ''
  if (!contentType.includes('application/json')) {
    return respond({ error: 'Invalid content type' }, 415)
  }

  const payload = await request.json().catch(() => null) as { prompt?: unknown; turnstileToken?: string } | null
  const prompt = typeof payload?.prompt === 'string' ? payload.prompt.trim() : ''

  if (!prompt) {
    return respond({ error: 'Prompt required' }, 400)
  }

  if (prompt.length > MAX_PROMPT_CHARS) {
    return respond({ error: 'Prompt too long' }, 400)
  }

  const clientId = getClientId(request, isLocal)
  if (!clientId) {
    return respond({ error: 'Missing client IP' }, 403)
  }
  const ipHash = hashPrompt(clientId)
  const allowlisted = parseAllowlist(env.RATE_LIMIT_ALLOW_IPS).has(clientId)
  if (!allowlisted) {
    const abuseState = await getAbuseState(env, `ip:${clientId}`)
    if (abuseState?.bannedUntil && abuseState.bannedUntil > Date.now()) {
      queueAlert('abuse_ban', { ipHash, origin })
      queueEmail('abuse_ban', { ipHash, origin })
      return respond(
        { error: 'Temporarily blocked', retryAfter: Math.ceil((abuseState.bannedUntil - Date.now()) / 1000) },
        429
      )
    }

    const sessionCooldown = await checkCooldown(env, `session:${session.id}`, COOLDOWN_WINDOW_MS)
    if (!sessionCooldown.allowed) {
      const updated = await registerAbuse(env, `ip:${clientId}`)
      if (updated.bannedUntil > Date.now()) {
        queueAlert('abuse_ban', { ipHash, origin })
        queueEmail('abuse_ban', { ipHash, origin })
        return respond(
          { error: 'Temporarily blocked', retryAfter: Math.ceil((updated.bannedUntil - Date.now()) / 1000) },
          429
        )
      }
      queueAlert('cooldown', { ipHash, origin, retryAfter: sessionCooldown.retryAfter })
      queueEmail('cooldown', { ipHash, origin, retryAfter: sessionCooldown.retryAfter })
      return respond({ error: 'Cooldown active', retryAfter: sessionCooldown.retryAfter }, 429)
    }
    const ipCooldown = await checkCooldown(env, `ip:${clientId}`, COOLDOWN_WINDOW_MS)
    if (!ipCooldown.allowed) {
      const updated = await registerAbuse(env, `ip:${clientId}`)
      if (updated.bannedUntil > Date.now()) {
        queueAlert('abuse_ban', { ipHash, origin })
        queueEmail('abuse_ban', { ipHash, origin })
        return respond(
          { error: 'Temporarily blocked', retryAfter: Math.ceil((updated.bannedUntil - Date.now()) / 1000) },
          429
        )
      }
      queueAlert('cooldown', { ipHash, origin, retryAfter: ipCooldown.retryAfter })
      queueEmail('cooldown', { ipHash, origin, retryAfter: ipCooldown.retryAfter })
      return respond({ error: 'Cooldown active', retryAfter: ipCooldown.retryAfter }, 429)
    }

    const globalLimit = await checkRateLimit(env, 'global', GLOBAL_RATE_LIMIT_MAX, GLOBAL_RATE_LIMIT_WINDOW_MS)
    if (!globalLimit.allowed) {
      queueAlert('rate_limited', { ipHash, origin, retryAfter: globalLimit.retryAfter })
      queueEmail('rate_limited', { ipHash, origin, retryAfter: globalLimit.retryAfter })
      return respond({ error: 'Rate limit exceeded', retryAfter: globalLimit.retryAfter }, 429)
    }

    const sessionLimit = await checkRateLimit(env, `session:${session.id}`, SESSION_RATE_LIMIT_MAX, SESSION_RATE_LIMIT_WINDOW_MS)
    if (!sessionLimit.allowed) {
      queueAlert('rate_limited', { ipHash, origin, retryAfter: sessionLimit.retryAfter })
      queueEmail('rate_limited', { ipHash, origin, retryAfter: sessionLimit.retryAfter })
      return respond({ error: 'Rate limit exceeded', retryAfter: sessionLimit.retryAfter }, 429)
    }

    const rateLimit = await checkRateLimit(env, `ip:${clientId}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)
    if (!rateLimit.allowed) {
      queueAlert('rate_limited', { ipHash, origin, retryAfter: rateLimit.retryAfter })
      queueEmail('rate_limited', { ipHash, origin, retryAfter: rateLimit.retryAfter })
      return respond({ error: 'Rate limit exceeded', retryAfter: rateLimit.retryAfter }, 429)
    }
  }

  if (!env.TURNSTILE_SECRET && !isLocal) {
    return respond({ error: 'Turnstile not configured' }, 500)
  }

  if (env.TURNSTILE_SECRET) {
    if (!payload?.turnstileToken) {
      queueAlert('turnstile_missing', { ipHash, origin })
      queueEmail('turnstile_missing', { ipHash, origin })
      return respond({ error: 'Turnstile required' }, 400)
    }
    const verified = await verifyTurnstile(env.TURNSTILE_SECRET, payload.turnstileToken, clientId)
    if (!verified) {
      queueAlert('turnstile_failed', { ipHash, origin })
      queueEmail('turnstile_failed', { ipHash, origin })
      return respond({ error: 'Turnstile failed' }, 403)
    }
  }

  const chatHistory = await getChatHistory(env, session.id)
  const historySignature = buildHistorySignature(chatHistory)

  const normalizedPrompt = normalizePrompt(prompt)
  const bulletCount = getBulletCount(prompt)
  const suggestedReply = getSuggestedReply(normalizedPrompt)
  if (suggestedReply) {
    const replyRaw = bulletCount ? applyBulletFormatting(suggestedReply, bulletCount) : finalizeReply(suggestedReply)
    const reply = clampReply(replyRaw, MAX_REPLY_CHARS)
    await setCachedReply(env, hashPrompt(`${CACHE_VERSION}|suggested|${normalizedPrompt}`), reply)
    await setChatHistory(env, session.id, [...chatHistory, { role: 'user', text: prompt }, { role: 'assistant', text: reply }])
    return respond({ reply }, 200)
  }
  const cacheKey = bulletCount
    ? `${CACHE_VERSION}|${normalizedPrompt}|bullets:${bulletCount}|history:${historySignature}`
    : `${CACHE_VERSION}|${normalizedPrompt}|history:${historySignature}`
  const promptKey = hashPrompt(cacheKey)
  const cachedReply = await getCachedReply(env, promptKey)
  if (cachedReply) {
    const replyRaw = bulletCount ? applyBulletFormatting(cachedReply, bulletCount) : finalizeReply(cachedReply)
    const reply = clampReply(replyRaw, MAX_REPLY_CHARS)
    await setChatHistory(env, session.id, [...chatHistory, { role: 'user', text: prompt }, { role: 'assistant', text: reply }])
    return respond({ reply, cached: true }, 200)
  }

  const primaryModel = env.GEMINI_MODEL_PRIMARY || env.GEMINI_MODEL || DEFAULT_MODEL_PRIMARY
  const fallbackModel = env.GEMINI_MODEL_FALLBACK || DEFAULT_MODEL_FALLBACK

  const formattedPrompt = bulletCount
    ? `${prompt}\n\nFormatting: Respond with exactly ${bulletCount} bullet points. Use "-" and no extra text. Each bullet must be a complete sentence. Keep the total response under ${MAX_REPLY_CHARS} characters.`
    : `${prompt}\n\nKeep the response under ${MAX_REPLY_CHARS} characters.`

  const historyForModel = toGeminiHistory(chatHistory)
  let result = await callGemini(primaryModel, env.GEMINI_API_KEY, formattedPrompt, historyForModel)

  if (!result.ok && fallbackModel && fallbackModel !== primaryModel) {
    result = await callGemini(fallbackModel, env.GEMINI_API_KEY, formattedPrompt, historyForModel)
  }

  if (!result.ok) {
    return respond({ error: 'AI provider error' }, 502)
  }

  if (!bulletCount && needsExpansion(prompt, result.reply)) {
    const expansionPrompt = `${formattedPrompt}\n\nProvide 2-3 complete sentences and ensure the final sentence is complete.`
    let expanded = await callGemini(primaryModel, env.GEMINI_API_KEY, expansionPrompt, historyForModel)
    if (!expanded.ok && fallbackModel && fallbackModel !== primaryModel) {
      expanded = await callGemini(fallbackModel, env.GEMINI_API_KEY, expansionPrompt, historyForModel)
    }
    if (expanded.ok) {
      result = expanded
    }
  }

  let replyText = result.reply
  if (!bulletCount && needsExpansion(prompt, replyText)) {
    replyText = buildFallbackSummary()
  }

  const replyRaw = bulletCount ? applyBulletFormatting(result.reply, bulletCount) : finalizeReply(replyText)
  const reply = clampReply(replyRaw, MAX_REPLY_CHARS)
  await setCachedReply(env, promptKey, reply)
  await setChatHistory(env, session.id, [...chatHistory, { role: 'user', text: prompt }, { role: 'assistant', text: reply }])
  return respond({ reply }, 200)
  } catch (error) {
    console.error('ask handler error', error)
    return respondWithOrigin({ error: 'Internal error' }, 500)
  }
}
