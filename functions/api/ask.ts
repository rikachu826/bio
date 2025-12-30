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
If the user challenges bias, acknowledge your purpose and respond with evidence from the resume.
Keep responses under 500 characters (roughly under 120 tokens). Use bullets when a multi-part answer fits better.

Resume context:
${RESUME_CONTEXT}
`

const DEFAULT_MODEL_PRIMARY = 'gemini-3-flash-preview'
const DEFAULT_MODEL_FALLBACK = 'gemini-2.5-flash'
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
const MAX_REPLY_CHARS = 500
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
}

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://leochui.tech',
  'https://www.leochui.tech',
])

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
  origin?: string,
  extraHeaders?: HeadersInit
) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  })
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin')
  }
  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, value]) => {
      headers.set(key, value)
    })
  }
  return new Response(JSON.stringify(body), { status, headers })
}

function corsResponse(origin?: string) {
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin')
  }
  return new Response(null, { status: 204, headers })
}

function getClientId(request: Request) {
  return request.headers.get('cf-connecting-ip')
    || request.headers.get('x-forwarded-for')
    || 'unknown'
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
    const current = await env.RATE_LIMIT_KV.get(storageKey, 'json')
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

async function checkCooldown(env: Env, key: string, windowMs: number) {
  const now = Date.now()
  const storageKey = `cooldown:${key}`
  const windowSeconds = Math.ceil(windowMs / 1000)

  if (env.RATE_LIMIT_KV) {
    const current = await env.RATE_LIMIT_KV.get(storageKey, 'json') as CooldownState | null
    if (current && now - current.last < windowMs) {
      return { allowed: false, retryAfter: Math.ceil((windowMs - (now - current.last)) / 1000) }
    }
    await env.RATE_LIMIT_KV.put(storageKey, JSON.stringify({ last: now }), { expirationTtl: windowSeconds })
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
    return await env.RATE_LIMIT_KV.get(storageKey, 'json') as AbuseState | null
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

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  const data = await response.json().catch(() => null) as { success?: boolean }
  return Boolean(data?.success)
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
    const stored = await env.RATE_LIMIT_KV.get(historyKey, 'json') as ChatMessage[] | null
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
      current = match[2]?.trim() || ''
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

function applyBulletFormatting(text: string, count: number) {
  const bulletLines = extractBulletLines(text)
  let items = bulletLines.length > 0 ? bulletLines : splitIntoSegments(text)
  items = expandSegments(items, count)

  const normalized = new Set(items.map((item) => item.toLowerCase()))
  for (const fallback of BULLET_FALLBACKS) {
    if (items.length >= count) {
      break
    }
    if (!normalized.has(fallback.toLowerCase())) {
      items.push(fallback)
    }
  }

  const formatted = items.slice(0, count).map((item) => {
    const sentence = item.split(/[.!?]/)[0]?.trim() || item.trim()
    const clipped = sentence.length > 160 ? `${sentence.slice(0, 157).trim()}...` : sentence
    return `- ${clipped}`
  })

  return formatted.join('\n')
}

function finalizeReply(text: string) {
  const trimmed = text.trim()
  if (!trimmed) {
    return trimmed
  }
  if (/[.!?]$/.test(trimmed)) {
    return trimmed
  }
  if (/[,:;]$/.test(trimmed)) {
    return trimmed.replace(/[,:;]+$/, '.')
  }
  const lastPunct = Math.max(trimmed.lastIndexOf('.'), trimmed.lastIndexOf('!'), trimmed.lastIndexOf('?'))
  if (lastPunct !== -1) {
    return trimmed.slice(0, lastPunct + 1)
  }
  return `${trimmed}.`
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

async function getCachedReply(env: Env, key: string) {
  const cacheKey = `cache:${key}`
  const now = Date.now()

  if (env.RATE_LIMIT_KV) {
    const entry = await env.RATE_LIMIT_KV.get(cacheKey, 'json') as CacheState | null
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

  const geminiResponse = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 220,
        topP: 0.9,
      },
    }),
  })

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

export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  const origin = request.headers.get('Origin') || undefined

  if (!origin || !allowedOrigins.has(origin)) {
    return jsonResponse({ error: 'Forbidden' }, 403, origin)
  }

  if (request.method === 'OPTIONS') {
    return corsResponse(origin)
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, origin)
  }

  const session = getSessionId(request)
  const sessionCookie = session.isNew ? buildSessionCookie(session.id) : null
  const responseHeaders = sessionCookie ? { 'Set-Cookie': sessionCookie } : undefined
  const respond = (body: Record<string, unknown>, status = 200) =>
    jsonResponse(body, status, origin, responseHeaders)

  if (!env.GEMINI_API_KEY) {
    return respond({ error: 'Missing API key' }, 500)
  }

  const contentType = request.headers.get('Content-Type') || ''
  if (!contentType.includes('application/json')) {
    return respond({ error: 'Invalid content type' }, 415)
  }

  const payload = await request.json().catch(() => null) as { prompt?: string; turnstileToken?: string }
  const prompt = payload?.prompt?.trim()

  if (!prompt) {
    return respond({ error: 'Prompt required' }, 400)
  }

  if (prompt.length > MAX_PROMPT_CHARS) {
    return respond({ error: 'Prompt too long' }, 400)
  }

  const clientId = getClientId(request)
  const allowlisted = parseAllowlist(env.RATE_LIMIT_ALLOW_IPS).has(clientId)
  if (!allowlisted) {
    const abuseState = await getAbuseState(env, `ip:${clientId}`)
    if (abuseState?.bannedUntil && abuseState.bannedUntil > Date.now()) {
      return respond(
        { error: 'Temporarily blocked', retryAfter: Math.ceil((abuseState.bannedUntil - Date.now()) / 1000) },
        429
      )
    }

    const sessionCooldown = await checkCooldown(env, `session:${session.id}`, COOLDOWN_WINDOW_MS)
    if (!sessionCooldown.allowed) {
      const updated = await registerAbuse(env, `ip:${clientId}`)
      if (updated.bannedUntil > Date.now()) {
        return respond(
          { error: 'Temporarily blocked', retryAfter: Math.ceil((updated.bannedUntil - Date.now()) / 1000) },
          429
        )
      }
      return respond({ error: 'Cooldown active', retryAfter: sessionCooldown.retryAfter }, 429)
    }
    const ipCooldown = await checkCooldown(env, `ip:${clientId}`, COOLDOWN_WINDOW_MS)
    if (!ipCooldown.allowed) {
      const updated = await registerAbuse(env, `ip:${clientId}`)
      if (updated.bannedUntil > Date.now()) {
        return respond(
          { error: 'Temporarily blocked', retryAfter: Math.ceil((updated.bannedUntil - Date.now()) / 1000) },
          429
        )
      }
      return respond({ error: 'Cooldown active', retryAfter: ipCooldown.retryAfter }, 429)
    }

    const globalLimit = await checkRateLimit(env, 'global', GLOBAL_RATE_LIMIT_MAX, GLOBAL_RATE_LIMIT_WINDOW_MS)
    if (!globalLimit.allowed) {
      return respond({ error: 'Rate limit exceeded', retryAfter: globalLimit.retryAfter }, 429)
    }

    const sessionLimit = await checkRateLimit(env, `session:${session.id}`, SESSION_RATE_LIMIT_MAX, SESSION_RATE_LIMIT_WINDOW_MS)
    if (!sessionLimit.allowed) {
      return respond({ error: 'Rate limit exceeded', retryAfter: sessionLimit.retryAfter }, 429)
    }

    const rateLimit = await checkRateLimit(env, `ip:${clientId}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)
    if (!rateLimit.allowed) {
      return respond({ error: 'Rate limit exceeded', retryAfter: rateLimit.retryAfter }, 429)
    }
  }

  if (env.TURNSTILE_SECRET) {
    if (!payload?.turnstileToken) {
      return respond({ error: 'Turnstile required' }, 400)
    }
    const verified = await verifyTurnstile(env.TURNSTILE_SECRET, payload.turnstileToken, clientId)
    if (!verified) {
      return respond({ error: 'Turnstile failed' }, 403)
    }
  }

  const chatHistory = await getChatHistory(env, session.id)
  const historySignature = buildHistorySignature(chatHistory)

  const normalizedPrompt = normalizePrompt(prompt)
  const bulletCount = getBulletCount(prompt)
  const cacheKey = bulletCount
    ? `${normalizedPrompt}|bullets:${bulletCount}|history:${historySignature}`
    : `${normalizedPrompt}|history:${historySignature}`
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
    ? `${prompt}\n\nFormatting: Respond with exactly ${bulletCount} bullet points. Use "-" and no extra text. Keep the total response under ${MAX_REPLY_CHARS} characters.`
    : `${prompt}\n\nKeep the response under ${MAX_REPLY_CHARS} characters.`

  const historyForModel = toGeminiHistory(chatHistory)
  let result = await callGemini(primaryModel, env.GEMINI_API_KEY, formattedPrompt, historyForModel)

  if (!result.ok && fallbackModel && fallbackModel !== primaryModel) {
    result = await callGemini(fallbackModel, env.GEMINI_API_KEY, formattedPrompt, historyForModel)
  }

  if (!result.ok) {
    return respond({ error: 'AI provider error' }, 502)
  }

  const replyRaw = bulletCount ? applyBulletFormatting(result.reply, bulletCount) : finalizeReply(result.reply)
  const reply = clampReply(replyRaw, MAX_REPLY_CHARS)
  await setCachedReply(env, promptKey, reply)
  await setChatHistory(env, session.id, [...chatHistory, { role: 'user', text: prompt }, { role: 'assistant', text: reply }])
  return respond({ reply }, 200)
}
