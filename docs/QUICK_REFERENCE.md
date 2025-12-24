# Resume - Quick Reference

## 30-Second Overview
- **What**: 3D animated personal resume website featuring IT leadership experience and LuminOS project
- **Tech**: React 18 + TypeScript + Vite / Three.js + React Three Fiber / Framer Motion / Tailwind CSS
- **Status**: Development (Local)
- **Deploy**: Cloudflare Pages (via GitHub Actions CI/CD)

## 🚫 NEVER DO THESE (Lessons Learned)
| ❌ DON'T | ✅ DO INSTEAD |
|---------|---------------|
| *To be filled as we learn* | |

## 📁 File Structure
```
Resume/
├── docs/                          # Documentation
│   ├── QUICK_REFERENCE.md         # This file (read first)
│   ├── SYSTEM_STATUS.md           # Architecture overview
│   ├── DEPLOYMENT_GUIDE.md        # Cloudflare Pages setup
│   ├── CHANGELOG.md               # Version history
│   └── ROADMAP.md                 # Future features
├── src/
│   ├── components/                # React components
│   │   ├── Hero.tsx               # 3D animated hero section
│   │   ├── About.tsx              # About me section
│   │   ├── Experience.tsx         # IT career timeline
│   │   ├── Projects.tsx           # Featured projects (LuminOS)
│   │   ├── Skills.tsx             # Tech stack showcase
│   │   ├── Contact.tsx            # Contact information
│   │   └── Scene/                 # 3D Three.js components
│   ├── hooks/                     # Custom React hooks
│   ├── utils/                     # Helpers, constants
│   ├── styles/                    # Global styles
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # Entry point
├── public/                        # Static assets
├── .github/workflows/             # GitHub Actions CI/CD
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🚀 Common Commands

**Initial Setup:**
```bash
cd Resume
npm install                        # Install dependencies
```

**Development:**
```bash
npm run dev                        # Start dev server (http://localhost:5173)
npm run build                      # Build for production
npm run preview                    # Preview production build locally
```

**Deployment:**
```bash
git add .
git commit -m "feat: update resume content"
git push origin main               # Triggers auto-deploy to Cloudflare Pages
```

**Linting/Formatting:**
```bash
npm run lint                       # Check code quality
npm run format                     # Auto-format code (if configured)
```

## 🎨 Design System

**Color Palette (Apple-inspired with color splashes):**
- Deep Space Black: `#0a0a0a`
- Charcoal: `#1c1c1e`
- Soft Gray: `#8e8e93`
- Pure White: `#ffffff`
- Iridescent Accent: `linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)`

**Typography:**
- Headings: SF Pro Display (fallback: system-ui)
- Body: SF Pro Text (fallback: -apple-system)

**Animation Principles:**
- Easing: `cubic-bezier(0.4, 0.0, 0.2, 1)` (Apple standard)
- Duration: 300ms (micro), 600ms (standard), 1200ms (hero reveals)
- 3D Performance: Target 60fps, adaptive quality based on device

## 🔄 Data Flow

1. **User visits site** → Vite serves React app
2. **Hero loads** → Three.js initializes 3D scene
3. **User scrolls** → Framer Motion triggers section animations
4. **User interacts** → Mouse movements affect 3D elements
5. **Content renders** → Tailwind-styled components display resume data

## 🌐 Deployment Flow

```
Local Dev → Git Commit → GitHub Push → GitHub Actions → Build → Cloudflare Pages → Live Site
```

## 📚 When You Need More Detail

- **Full architecture**: Read `SYSTEM_STATUS.md`
- **Deployment setup**: Read `DEPLOYMENT_GUIDE.md`
- **Feature roadmap**: Read `ROADMAP.md`
- **Version history**: Read `CHANGELOG.md`

## 🔧 Performance Optimizations

- **3D Scene**: Lazy load Three.js components, adaptive quality
- **Images**: WebP format, lazy loading
- **Code Splitting**: Route-based chunks
- **Bundle Size**: Tree-shaking, minification
- **Caching**: Cloudflare CDN edge caching

## 🎯 Featured Content

- **Top Project**: LuminOS (featured prominently)
- **Career**: Associate IT Director at GLAAD
- **Other Projects**: Visible in Projects section

---

**Last Updated**: 2025-12-23
