# Resume - Deployment Guide

**Target Platform**: Cloudflare Pages
**CI/CD**: GitHub Actions
**Domain**: Your custom domain (configured in Cloudflare)

---

## Prerequisites

Before deploying, ensure you have:

- [x] **GitHub Account** (for repository hosting)
- [x] **Cloudflare Account** (free tier is sufficient)
- [x] **Custom Domain** (already registered in Cloudflare)
- [x] **Git Installed** (version control)
- [x] **Node.js** (v18+ recommended)

---

## Deployment Methods

### Option 1: GitHub Actions CI/CD (Recommended)

**Fully automated**: Push to GitHub → Auto-deploy to Cloudflare Pages

#### Step 1: Create GitHub Repository

```bash
cd Resume
git init
git add .
git commit -m "feat: initial resume scaffolding"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/resume.git
git push -u origin main
```

#### Step 2: Get Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use template: **Edit Cloudflare Workers**
4. Permissions:
   - Account → Cloudflare Pages → Edit
5. Copy the generated API token

#### Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Add these secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found in Cloudflare dashboard)

#### Step 4: GitHub Actions Workflow (Already Configured)

The workflow file `.github/workflows/deploy.yml` will:
- Trigger on push to `main` branch
- Install dependencies
- Build React app
- Deploy to Cloudflare Pages

**That's it!** Every push to `main` auto-deploys.

---

### Option 2: Cloudflare Dashboard Manual Setup

**One-time setup via Cloudflare UI**

#### Step 1: Create Pages Project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `Resume` (if monorepo)

#### Step 2: Deploy

Click **Save and Deploy**. Cloudflare will:
- Clone your repo
- Install dependencies (`npm install`)
- Run build (`npm run build`)
- Deploy to global CDN

---

## Custom Domain Configuration

### Step 1: Add Custom Domain

1. In Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `resume.yourdomain.com` or `yourdomain.com`)

### Step 2: DNS Configuration (Automatic)

Cloudflare auto-configures DNS:
- **CNAME record**: Points to `your-project.pages.dev`
- **SSL/TLS**: Automatic HTTPS with free certificate

**Propagation**: Usually instant (max 24 hours)

---

## Environment Variables (Required for AI Assistant)

If you want the Tifa assistant to work in production, you must set these in
Cloudflare Pages → **Settings** → **Environment variables** (choose Production, and Preview if you use it),
then redeploy.

**Secrets**
- `GEMINI_API_KEY` (required)
- `TURNSTILE_SECRET` (required)

**Plaintext**
- `VITE_TURNSTILE_SITE_KEY` (required, build-time)
- `GEMINI_MODEL_PRIMARY` (optional override)
- `GEMINI_MODEL_FALLBACK` (optional override)
- `RATE_LIMIT_ALLOW_IPS` (optional allowlist, comma/space-separated)
- `ALERT_WEBHOOK_URL` (optional, for security alerts)
- `ALERT_WEBHOOK_EVENTS` (optional, comma/space-separated)

**Secrets (optional)**
- `ALERT_WEBHOOK_SECRET` (HMAC signature for alert payloads)

**Important**: Any change to `VITE_` variables requires a redeploy so the frontend build picks them up.

---

## Deployment Verification

After deployment:

### 1. Check Build Logs
```bash
# In Cloudflare Dashboard → Pages → Deployments
# View build logs for errors
```

### 2. Test Deployed Site
```bash
# Visit your Cloudflare Pages URL
https://your-project.pages.dev

# Or your custom domain
https://yourdomain.com
```

### 3. Performance Audit
```bash
# Run Lighthouse in Chrome DevTools
# Target scores:
# - Performance: 95+
# - Accessibility: 95+
# - Best Practices: 100
# - SEO: 100
```

---

## Rollback Procedure

If deployment fails or has issues:

### Via Cloudflare Dashboard
1. Go to **Pages** → **Deployments**
2. Find previous working deployment
3. Click **...** → **Rollback to this deployment**

### Via Git
```bash
# Revert last commit
git revert HEAD
git push origin main

# Or hard reset (destructive)
git reset --hard <commit-hash>
git push origin main --force
```

---

## CI/CD Workflow Details

**Trigger**: Push to `main` branch

**Steps**:
1. Checkout code
2. Setup Node.js (v18)
3. Install dependencies (`npm ci`)
4. Build app (`npm run build`)
5. Deploy to Cloudflare Pages (via Wrangler)

**Build Time**: ~2-5 minutes

**Deployment**: Instant (global CDN propagation)

---

## Troubleshooting

### Build Fails on Cloudflare

**Issue**: `npm install` errors

**Solution**:
```bash
# Ensure package-lock.json is committed
git add package-lock.json
git commit -m "chore: add package-lock.json"
git push
```

### 404 on Custom Domain

**Issue**: Domain shows 404 or old content

**Solutions**:
1. Check DNS propagation: https://dnschecker.org
2. Clear Cloudflare cache: Dashboard → Caching → Purge Everything
3. Verify CNAME record points to `your-project.pages.dev`

### Three.js Not Loading

**Issue**: 3D graphics not rendering

**Solutions**:
1. Check browser console for errors
2. Ensure WebGL is supported (modern browser required)
3. Verify Three.js assets are in `public/` folder (if any)

---

## Performance Optimization

### Cloudflare Settings

1. **Auto Minify**: Enable HTML, CSS, JS
2. **Brotli Compression**: Enabled by default
3. **HTTP/3**: Enable for faster loading
4. **Rocket Loader**: Disabled (conflicts with React)

### Build Optimization

```bash
# Analyze bundle size
npm run build -- --analyze

# Check for large dependencies
npx vite-bundle-visualizer
```

---

## Security Hardening

### Cloudflare Security Settings

1. **SSL/TLS**: Full (strict) mode
2. **Always Use HTTPS**: Enabled
3. **HSTS**: Enabled with preload
4. **WAF**: Basic rules enabled (free tier)

### Edge Rules (Optional)

If you previously added allowlist or bypass rules, they usually live here:
- **Security → WAF → Custom rules** (formerly Firewall Rules)
- **Security → WAF → IP Access Rules** (account or zone-level)
- **Security → Rate Limiting** (bypass/allowlist for `/api/ask`)

Use these to skip edge challenges for your IP while keeping public protections enabled.

### Content Security Policy

Add CSP headers in Cloudflare Pages:

```
// _headers file in public/
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://static.cloudflareinsights.com; font-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com; media-src 'self' blob:; object-src 'none'; frame-src https://challenges.cloudflare.com; child-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

---

## Monitoring & Analytics

### Cloudflare Analytics (Free)

1. Go to **Pages** → **Analytics**
2. View:
   - Page views
   - Unique visitors
   - Geographic distribution
   - Performance metrics (Core Web Vitals)

**Privacy-first**: No cookies, GDPR-compliant

### Function Logs (Ask Tifa)

1. Cloudflare Dashboard → **Pages** → your project
2. Open **Functions** → **Logs** (or **Logs/Tail**)
3. Filter for `/api/ask` requests

### Alerting (Optional)

Set `ALERT_WEBHOOK_URL` to receive JSON alerts for security events.
Default events: `abuse_ban`, `turnstile_failed`. Customize with `ALERT_WEBHOOK_EVENTS`.

---

## Maintenance Schedule

**Weekly**: Check for dependency updates
```bash
npm outdated
```

**Monthly**: Security audit
```bash
npm audit
npm audit fix
```

**Quarterly**: Performance review (Lighthouse audit)

---

## Emergency Contacts

- **Cloudflare Status**: https://www.cloudflarestatus.com
- **GitHub Status**: https://www.githubstatus.com
- **Support**: Cloudflare Community (free tier)

---

**Last Updated**: 2026-01-19
**Next Review**: 2026-02-19
