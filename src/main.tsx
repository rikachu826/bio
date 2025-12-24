import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const logSignature = () => {
  if (typeof window === 'undefined') {
    return
  }

  if ('fonts' in document) {
    document.fonts.load('600 18px Orbitron')
    document.fonts.load('400 28px Allura')
  }

  const titleStyle = [
    "font-family: 'Allura', cursive",
    'font-size: 30px',
    'color: #7dd3fc',
    'text-shadow: 0 0 12px rgba(56, 189, 248, 0.6)',
    'margin-bottom: 6px',
  ].join('; ')

  const labelStyle = [
    "font-family: 'Orbitron', sans-serif",
    'font-size: 12px',
    'letter-spacing: 3px',
    'color: #cbd5f5',
    'text-transform: uppercase',
  ].join('; ')

  const linkStyle = [
    "font-family: 'Orbitron', sans-serif",
    'font-size: 11px',
    'letter-spacing: 2px',
    'color: #38bdf8',
  ].join('; ')

  console.log('%cLeo Chui', titleStyle)
  console.log('%cAI-augmented systems | security | infrastructure', labelStyle)
  console.log('%cleochui.tech', linkStyle)
}

logSignature()
