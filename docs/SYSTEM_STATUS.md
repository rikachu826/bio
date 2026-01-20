# Resume - System Status

**Last Updated**: 2026-01-19  
**Status**: Production  
**Environment**: Cloudflare Pages + Functions

---

## Current Architecture

### Frontend Stack
```
React 18.3 + TypeScript 5.6
├── Vite 6.x (build + dev server)
├── Three.js 0.171 + React Three Fiber + drei (3D scene)
├── Framer Motion 11.x (animation)
├── Tailwind CSS 3.4 (styling)
└── pdf-lib (PDF export)
```

### Deployment Infrastructure
```
GitHub → GitHub Actions (lint/audit/build) → Cloudflare Pages
Cloudflare Pages Functions → /api/ask (Gemini + Turnstile)
Cloudflare KV → rate limits + caching + chat history
```

---

## Component Architecture

### Page Structure
```
App.tsx
├── IntroOverlay
├── Hero
├── About
├── Experience
├── Projects
├── CommandCenter
├── Skills
├── Contact
└── AIAssistant (Tifa)
```

### 3D Scene Components
```
Scene/
├── GalaxyBackground.tsx
├── GeometricShapes.tsx
└── Starfield.tsx
```

---

## Performance Strategy (Current)

- Three.js Canvas uses `antialias: false` and `dpr: [1, 1.5]` to cap GPU load.
- Starfield uses precomputed positions (5k points) and simple per-frame rotations.
- Project images are lazy-loaded in grids; the lightbox loads full media only when opened.
- Large media assets remain the main performance risk on low-end devices.

---

## Environment Configuration

### Production (Cloudflare Pages)
```
GEMINI_API_KEY (secret)
TURNSTILE_SECRET (secret)
VITE_TURNSTILE_SITE_KEY (plaintext, build-time)
GEMINI_MODEL_PRIMARY (optional)
GEMINI_MODEL_FALLBACK (optional)
RATE_LIMIT_ALLOW_IPS (optional allowlist)
ALERT_WEBHOOK_URL (optional)
ALERT_WEBHOOK_EVENTS (optional)
ALERT_WEBHOOK_SECRET (optional, HMAC for alerts)
```

---

## Security Measures

- CSP + security headers enforced via `public/_headers`.
- Origin allowlist for `/api/ask`.
- Turnstile required in production (fails closed if not configured).
- KV-backed rate limits (global + session + IP) plus cooldown/abuse tracking.
- HttpOnly/Secure/SameSite session cookie.
- Resume content is repo-controlled (no user-generated content).

---

## Monitoring & Analytics

- Cloudflare Pages Analytics (traffic + Core Web Vitals).
- Cloudflare Pages Functions logs for `/api/ask`.
- GitHub Actions runs lint + `npm audit` on each deploy.

---

## Current Limitations

- Large project media assets can be heavy on low-end devices.
- WebGL scenes may strain older GPUs.
- No external error tracking (Sentry not configured).
