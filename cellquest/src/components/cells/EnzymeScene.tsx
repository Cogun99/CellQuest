import type { EnzymeRateResult } from '../../lib/enzymes'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useShouldPauseAnimation } from '../../hooks/useVisibilityPause'
import './Scenes.css'

interface EnzymeSceneProps {
  substrate: number
  temperatureC: number
  result: EnzymeRateResult
  running: boolean
}

export function EnzymeScene({ substrate, temperatureC, result, running }: EnzymeSceneProps) {
  const reduced = useReducedMotion()
  const { shouldPause, observeRef } = useShouldPauseAnimation()
  const animate = running && !reduced && !shouldPause && result.rate > 0.05

  const substrateCount = Math.min(14, Math.max(2, Math.round(substrate * 1.4)))

  return (
    <div ref={observeRef} className="scene">
      <svg viewBox="0 0 360 260" role="img" aria-label="Enzyme and substrate interactions">
        <rect width="360" height="260" rx="12" fill="#F6EBE7" />
        <text x="16" y="28" className="scene-label">
          Temp {temperatureC.toFixed(0)}°C · relative rate {result.rate.toFixed(2)}
        </text>
        <text x="16" y="48" className="scene-label">
          Status: {result.status.replace('-', ' ')}
        </text>

        <path
          d="M120 160 C120 110, 170 95, 200 120 C230 145, 220 190, 175 200 C140 208, 120 190, 120 160 Z"
          fill="#245C49"
          opacity={0.2 + result.temperatureFactor * 0.65}
        />
        <path
          d="M155 145 C170 130, 190 135, 195 150 C200 165, 180 175, 165 168 C150 160, 148 152, 155 145 Z"
          fill="#245C49"
        />
        <text x="150" y="220" className="scene-label">
          Enzyme
        </text>

        {Array.from({ length: substrateCount }, (_, i) => {
          const angle = (i / substrateCount) * Math.PI * 2
          const orbit = 70 + (i % 3) * 12
          const cx = 180 + Math.cos(angle) * orbit
          const cy = 150 + Math.sin(angle) * orbit * 0.7
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={6}
              fill="#D7836C"
              className={animate ? 'scene-orbit' : undefined}
              style={{
                animationDuration: `${1.2 + (1 - result.rate) * 2}s`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          )
        })}

        <text x="250" y="80" className="scene-label">
          Substrate
        </text>
      </svg>
    </div>
  )
}
