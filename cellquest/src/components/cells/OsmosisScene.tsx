import type { OsmosisState } from '../../lib/osmosis'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useShouldPauseAnimation } from '../../hooks/useVisibilityPause'
import './Scenes.css'

interface OsmosisSceneProps {
  state: OsmosisState
  running: boolean
}

export function OsmosisScene({ state, running }: OsmosisSceneProps) {
  const reduced = useReducedMotion()
  const { shouldPause, observeRef } = useShouldPauseAnimation()
  const animate = running && !reduced && !shouldPause

  const radius = 38 + state.volume * 28
  const arrowsIn = state.netWaterDirection === 1
  const arrowsOut = state.netWaterDirection === -1

  return (
    <div ref={observeRef} className="scene">
      <svg viewBox="0 0 360 260" role="img" aria-label="Animal cell volume responding to osmosis">
        <rect width="360" height="260" rx="12" fill="#EAF0E8" />
        <text x="16" y="28" className="scene-label">
          Outside: {state.externalConcentration.toFixed(2)} (relative)
        </text>
        <text x="16" y="48" className="scene-label">
          Inside: {state.internalConcentration.toFixed(2)} (relative)
        </text>

        {Array.from({ length: Math.round(state.externalConcentration * 8) }, (_, i) => (
          <circle
            key={`ext-${i}`}
            cx={30 + (i % 6) * 18}
            cy={70 + Math.floor(i / 6) * 22}
            r={3.5}
            fill="#D7836C"
            opacity={0.55}
          />
        ))}

        <g transform="translate(200 140)">
          <circle
            r={radius}
            fill="#F7F6F2"
            stroke="#245C49"
            strokeWidth="3.5"
            className={animate ? 'scene-pulse' : undefined}
          />
          <circle r={12} fill="#245C49" />
          {Array.from({ length: 5 }, (_, i) => (
            <circle
              key={`in-${i}`}
              cx={Math.cos(i * 1.1) * (radius * 0.45)}
              cy={Math.sin(i * 1.1) * (radius * 0.45)}
              r={3}
              fill="#D7836C"
              opacity={0.7}
            />
          ))}
        </g>

        {(arrowsIn || arrowsOut) &&
          [-40, 0, 40].map((y, i) => (
            <g
              key={y}
              className={animate ? 'scene-flow' : undefined}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <path
                d={arrowsIn ? `M 110 ${140 + y} H 150` : `M 150 ${140 + y} H 110`}
                stroke="#245C49"
                strokeWidth="2.5"
                markerEnd="url(#arrowHead)"
                opacity="0.7"
              />
            </g>
          ))}

        <defs>
          <marker id="arrowHead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#245C49" />
          </marker>
        </defs>

        <text x="16" y="240" className="scene-label">
          Volume {state.volume.toFixed(2)}
          {state.atModelLimit ? ' · model limit reached' : ''}
        </text>
      </svg>
    </div>
  )
}
