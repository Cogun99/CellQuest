import { useId, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './HeroCell.css'

interface Organelle {
  id: string
  label: string
  detail: string
  cx: number
  cy: number
  r: number
}

const ORGANELLES: Organelle[] = [
  {
    id: 'nucleus',
    label: 'Nucleus',
    detail: 'Houses DNA and directs cell activities — the control center.',
    cx: 160,
    cy: 145,
    r: 28,
  },
  {
    id: 'mito',
    label: 'Mitochondrion',
    detail: 'Breaks down fuel molecules to release usable energy (ATP).',
    cx: 98,
    cy: 118,
    r: 14,
  },
  {
    id: 'er',
    label: 'Endoplasmic reticulum',
    detail: 'A membrane network that helps make and move proteins and lipids.',
    cx: 220,
    cy: 110,
    r: 16,
  },
  {
    id: 'membrane',
    label: 'Plasma membrane',
    detail: 'A selective barrier that controls what enters and leaves the cell.',
    cx: 250,
    cy: 175,
    r: 12,
  },
]

export function HeroCell() {
  const reduced = useReducedMotion()
  const titleId = useId()
  const [activeId, setActiveId] = useState<string | null>('nucleus')
  const active = ORGANELLES.find((o) => o.id === activeId) ?? ORGANELLES[0]

  return (
    <div className={`hero-cell ${reduced ? 'is-reduced' : ''}`}>
      <svg
        viewBox="0 0 320 280"
        role="img"
        aria-labelledby={titleId}
        className="hero-cell__svg"
      >
        <title id={titleId}>Animated animal cell with clickable organelles</title>
        <defs>
          <radialGradient id="cyto" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#f4faf3" />
            <stop offset="100%" stopColor="#cfe0cc" />
          </radialGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#182321" floodOpacity="0.12" />
          </filter>
        </defs>

        <ellipse
          className="hero-cell__body"
          cx="160"
          cy="145"
          rx="118"
          ry="92"
          fill="url(#cyto)"
          stroke="#245C49"
          strokeWidth="3"
          filter="url(#soft)"
        />

        <ellipse className="hero-cell__drift" cx="120" cy="160" rx="10" ry="7" fill="#9bb89a" opacity="0.35" />
        <ellipse className="hero-cell__drift hero-cell__drift--b" cx="200" cy="175" rx="8" ry="6" fill="#9bb89a" opacity="0.28" />

        {/* ER suggestion */}
        <path
          d="M200 95 c20 8 28 22 18 38 c-6 10 -22 14 -34 8"
          fill="none"
          stroke="#245C49"
          strokeOpacity="0.35"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Mitochondrion */}
        <ellipse cx="98" cy="118" rx="22" ry="12" fill="#d7836c" opacity="0.85" />
        <path d="M86 118 c6 -6 12 6 18 0 c6 -6 12 6 18 0" fill="none" stroke="#7a4034" strokeWidth="1.5" />

        {/* Nucleus */}
        <circle cx="160" cy="145" r="34" fill="#245C49" opacity="0.18" />
        <circle cx="160" cy="145" r="26" fill="#245C49" />
        <circle cx="168" cy="138" r="7" fill="#dfe8de" opacity="0.7" />

        {ORGANELLES.map((o) => {
          const selected = o.id === active.id
          return (
            <g key={o.id}>
              <circle
                cx={o.cx}
                cy={o.cy}
                r={o.r + 10}
                className={`hero-cell__hit ${selected ? 'is-selected' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`${o.label}. ${o.detail}`}
                aria-pressed={selected}
                onClick={() => setActiveId(o.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveId(o.id)
                  }
                }}
              />
            </g>
          )
        })}
      </svg>

      <div className="hero-cell__caption" aria-live="polite">
        <h3>{active.label}</h3>
        <p>{active.detail}</p>
      </div>
    </div>
  )
}
