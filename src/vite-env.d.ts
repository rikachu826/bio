/// <reference types="vite/client" />

interface Window {
  turnstile?: {
    render: (
      element: HTMLElement,
      options: {
        sitekey: string
        theme?: 'light' | 'dark' | 'auto'
        size?: 'normal' | 'compact' | 'invisible'
        callback?: (token: string) => void
        'expired-callback'?: () => void
        'error-callback'?: () => void
      }
    ) => string | number
    reset: (widgetId?: string | number) => void
  }
}
