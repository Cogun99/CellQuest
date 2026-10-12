import {
  PARTICLE_SPECS,
  type MembraneToggles,
  canCross,
  type ParticleKind,
} from '../../lib/membranes'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useShouldPauseAnimation } from '../../hooks/useVisibilityPause'
import './Scenes.css'

interface MembraneSceneProps {
  toggles: MembraneToggles
  highlight: ParticleKind
  running: boolean
}

export function MembraneScene({ toggles, highlight, running }: MembraneSceneProps) {
  const reduced = useReducedMotion()
  const { shouldPause, observeRef } = useShouldPauseAnimation()
  const animate = running && !reduced && !shouldPause

  return (
    <div ref={observeRef} className="scene">
      <svg viewBox="0 0 360 280" role="img" aria-label="Selective membrane with particles">
        <rect width="360" height="280" rx="12" fill="#E8EEEA" />
        <text x="24" y="28" className="scene-label">
          Outside
        </text>
        <text x="280" y="28" className="scene-label">
          Inside
        </text>

        <rect x="168" y="40" width="24" height="200" rx="6" fill="#245C49" opacity="0.18" />
        <rect x="174" y="40" width="12" height="200" fill="#245C49" />

        <rect x="170" y="70" width="20" height="28" rx="4" fill="#DFE8DE" stroke="#245C49" />
        <text x="196" y="88" className="scene-label">
          aquaporin
        </text>

        <rect
          x="168"
          y="130"
          width="24"
          height="36"
          rx="6"
          fill={toggles.glucoseTransporter ? '#D7836C' : '#c5c5c0'}
          opacity={toggles.glucoseTransporter ? 1 : 0.45}
        />
        <text x="196" y="152" className="scene-label">
          transporter {toggles.glucoseTransporter ? 'ON' : 'OFF'}
        </text>

        <rect
          x="170"
          y="190"
          width="20"
          height="30"
          rx="4"
          fill={toggles.ionChannel ? '#245C49' : '#c5c5c0'}
          opacity={toggles.ionChannel ? 0.9 : 0.4}
        />
        <text x="196" y="210" className="scene-label">
          channel {toggles.ionChannel ? 'ON' : 'OFF'}
        </text>

        {PARTICLE_SPECS.map((p, index) => {
          const result = canCross(p.id, toggles)
          const y = 58 + index * 48
          const crossing = result.canCross && animate
          const isFocus = highlight === p.id
          const fill = p.id === 'sodium' ? '#245C49' : '#D7836C'
          return (
            <g key={p.id} opacity={isFocus ? 1 : 0.55}>
              {crossing ? (
                <circle
                  r={10}
                  fill={fill}
                  className="scene-cross"
                  style={{
                    offsetPath: `path('M 70 ${y} L 290 ${y}')`,
                    animationDuration: `${2.2 / Math.max(0.25, result.relativeRate)}s`,
                    animationDelay: `${index * 0.15}s`,
                  }}
                />
              ) : (
                <circle cx={70} cy={y} r={10} fill={fill} />
              )}
              <text x={40} y={y + 28} className="scene-label">
                {p.symbol} {result.canCross ? `via ${result.route}` : 'blocked'}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
