# Leo Chui — AI in Human Form

A cinematic, AI‑forward resume experience built for fast first impressions: nebula intro, glass UI, deep project modals, and a locked‑down AI assistant that only speaks from the resume context.

## Highlights
- Nebula intro gate with a cinematic curtain reveal
- LuminOS project suite with detailed, recruiter‑friendly modals
- Tifa AI assistant (resume‑only, cached, rate‑limited, Turnstile‑guarded)
- PDF export with styled, executive‑grade summaries
- Performance‑first motion and glass UI

## Stack
- React + Vite + TypeScript
- Framer Motion
- Tailwind + custom CSS utilities
- Cloudflare Pages + Functions
- Gemini API (via AI Studio)

## Security posture
- Origin‑locked API route (`/api/ask`)
- Turnstile enforced
- KV‑backed rate limits (global + per‑IP + per‑session)
- CSP + strict security headers

## Local dev
```bash
npm install
npm run dev
```

## Build & deploy (Cloudflare Pages)
```bash
npm run build
npx wrangler pages deploy dist --project-name "your project name"
```

## Env vars (Cloudflare Pages)
**Secrets**
- `GEMINI_API_KEY`
- `TURNSTILE_SECRET`

**Plaintext**
- `GEMINI_MODEL_PRIMARY`
- `GEMINI_MODEL_FALLBACK`
- `VITE_TURNSTILE_SITE_KEY`

## Notes
- Screenshots live in `Images/projects/<project>/` and are auto‑loaded into modals.
- Optional captions per project: add `Images/projects/<project>/captions.json` and map filenames to tooltip text.
  Example:
  ```json
  {
    "image.webp": "LuminOS dashboard overview",
    "Screenshot 2025-12-24 at 10.53.47 AM.png": "Security posture summary"
  }
  ```
- Command Center carousel captions: edit `Images/command-center/captions.json`.
- After adding screenshots or captions, restart the dev server, then commit + push to deploy.
- Replace the GitHub link in the footer if you fork.

---
Built to feel like a systems cockpit: fast, elegant, and unapologetically technical.
