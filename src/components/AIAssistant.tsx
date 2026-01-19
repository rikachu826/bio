import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const suggestions = [
  "Summarize Leo's strengths in 3 bullets.",
  'What is LuminOS and why it matters?',
  'Highlight the cloud/security transformation.',
  'Give me a quick technical overview.',
]

const avatarSrc = '/avatars/tifa.webp'

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
  const scrollRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetId = useRef<number | null>(null)

  const greeting = useMemo(
    () =>
      "Welcome to 7th Heaven. I'm Tifa. Ask me about Leo's systems work, security posture, or AI tooling, and I'll keep it concise.",
    []
  )
  const showSuggestions = messages.length === 0 && !isLoading

  useEffect(() => {
    if (!turnstileSiteKey || !isOpen || !turnstileRef.current) {
      return
    }

    let isMounted = true

    const renderWidget = () => {
      if (!isMounted || !turnstileRef.current || !window.turnstile) {
        return
      }
      if (turnstileWidgetId.current !== null) {
        return
      }

      const id = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'dark',
        size: 'compact',
        callback: (token: string) => {
          if (isMounted) {
            setTurnstileToken(token)
          }
        },
        'expired-callback': () => {
          if (isMounted) {
            setTurnstileToken('')
          }
        },
        'error-callback': () => {
          if (isMounted) {
            setTurnstileToken('')
          }
        },
      })

      turnstileWidgetId.current = typeof id === 'number' ? id : Number(id)
    }

    renderWidget()
    const interval = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(interval)
        renderWidget()
      }
    }, 250)

    return () => {
      isMounted = false
      window.clearInterval(interval)
      turnstileWidgetId.current = null
    }
  }, [isOpen, turnstileSiteKey])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      if (!target) {
        return
      }
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('touchstart', handlePointer)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('touchstart', handlePointer)
    }
  }, [isOpen])

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl || !isOpen) {
      return
    }
    const scrollToBottom = () => {
      scrollEl.scrollTop = scrollEl.scrollHeight
    }
    scrollToBottom()
    const timeout = window.setTimeout(scrollToBottom, 80)
    return () => window.clearTimeout(timeout)
  }, [messages, isLoading, isOpen])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const trimmed = prompt.trim()
    if (!trimmed) {
      setError('Drop a question to get started.')
      return
    }

    if (turnstileSiteKey && !turnstileToken) {
      setError('Complete the security check to continue.')
      return
    }

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setPrompt('')

    try {
      setIsLoading(true)
      const result = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed, turnstileToken }),
      })

      if (!result.ok) {
        const payload = await result.json().catch(() => null)
        throw new Error(payload?.error || 'Assistant unavailable right now.')
      }

      const data = await result.json()
      const reply = data?.reply || 'No response yet.'

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: reply,
        },
      ])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setError(message)
    } finally {
      setIsLoading(false)
      if (turnstileSiteKey && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current ?? undefined)
        setTurnstileToken('')
      }
    }
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9998]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="ai-fab group flex items-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-space-black/80 px-3 py-2 sm:px-4 sm:py-3
                   shadow-[0_0_30px_rgba(56,189,248,0.35)] backdrop-blur-xl transition-transform duration-200
                   hover:-translate-y-0.5"
        aria-expanded={isOpen}
        aria-controls="tifa-chat-panel"
        ref={buttonRef}
      >
        <span className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center overflow-hidden rounded-full border border-sky-blue/40">
          <img
            src={avatarSrc}
            alt="Tifa avatar"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 rounded-full ring-2 ring-cyan-400/30 animate-pulse-soft" />
        </span>
        <span className="text-left hidden sm:block">
          <span className="block text-sm font-semibold text-pure-white">Tifa</span>
          <span className="block text-xs text-soft-gray">Assistant</span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="tifa-chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`ai-panel absolute bottom-full right-0 mb-3 sm:relative sm:bottom-auto sm:right-auto sm:mt-4 sm:mb-0 rounded-3xl border border-white/10 bg-space-black/90 shadow-2xl backdrop-blur-xl ${
              isExpanded ? 'ai-panel-expanded' : ''
            }`}
            ref={panelRef}
          >
            <div className="relative overflow-hidden rounded-3xl">
              <div className="ai-panel-inner px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-pure-white tracking-[0.08em] uppercase">Tifa</p>
                    <p className="text-xs text-soft-gray">Owner of 7th Heaven</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsExpanded((prev) => !prev)}
                      className="text-soft-gray hover:text-pure-white transition-colors"
                      aria-label={isExpanded ? 'Collapse assistant' : 'Expand assistant'}
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? '⤡' : '⤢'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="text-soft-gray hover:text-pure-white transition-colors"
                      aria-label="Close assistant"
                      title="Close"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <p className="sr-only">
                  Tifa assistant disclaimer.
                </p>
              </div>

              <div
                ref={scrollRef}
                className={`overflow-y-auto px-4 sm:px-5 pb-3 sm:pb-4 space-y-3 ${isExpanded ? 'ai-scroll-expanded' : 'ai-scroll'}`}
              >
                {messages.length === 0 && (
                  <div className="ai-bubble ai-bubble-assistant">
                    {greeting}
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`ai-bubble ${message.role === 'user' ? 'ai-bubble-user' : 'ai-bubble-assistant'}`}
                  >
                    {message.text}
                  </div>
                ))}

                {isLoading && (
                  <div className="ai-bubble ai-bubble-assistant">
                    Tifa is analyzing…
                  </div>
                )}
              </div>

              {error && (
                <p className="px-4 sm:px-5 pb-2 sm:pb-3 text-xs sm:text-sm text-red-300">{error}</p>
              )}

              <div className="px-4 sm:px-5 pb-3 sm:pb-4">
                {showSuggestions && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                    {suggestions.map((text) => (
                      <button
                        key={text}
                        type="button"
                        onClick={() => setPrompt(text)}
                        className="ai-chip text-xs sm:text-sm"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                )}

                {turnstileSiteKey && (
                  <div className="turnstile-wrapper">
                    <div ref={turnstileRef} className="turnstile-widget" />
                    <p className="turnstile-hint">Security check required.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Ask about the systems, security, or AI tooling..."
                    className="ai-input"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="ai-submit"
                  >
                    {isLoading ? 'Briefing...' : 'Ask Tifa'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
