import type { ExperimentId } from '../../types/experiments'

interface ExperimentArtProps {
  id: ExperimentId
  className?: string
}

export function ExperimentArt({ id, className = '' }: ExperimentArtProps) {
  if (id === 'osmosis') {
    return (
      <svg viewBox="0 0 240 140" className={className} aria-hidden>
        <rect width="240" height="140" rx="16" fill="#DFE8DE" />
        <circle cx="90" cy="72" r="42" fill="#F7F6F2" stroke="#245C49" strokeWidth="3" />
        <circle cx="90" cy="72" r="12" fill="#245C49" />
        <circle cx="150" cy="40" r="4" fill="#D7836C" opacity="0.7" />
        <circle cx="170" cy="70" r="3.5" fill="#D7836C" opacity="0.55" />
        <circle cx="155" cy="100" r="5" fill="#D7836C" opacity="0.45" />
        <path d="M125 72 h40" stroke="#245C49" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
        <text x="170" y="68" fontSize="11" fill="#245C49">H₂O</text>
      </svg>
    )
  }

  if (id === 'enzymes') {
    return (
      <svg viewBox="0 0 240 140" className={className} aria-hidden>
        <rect width="240" height="140" rx="16" fill="#F0D5CC" />
        <path
          d="M40 95 C70 40, 110 40, 140 95"
          fill="none"
          stroke="#245C49"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="70" cy="58" r="8" fill="#D7836C" />
        <circle cx="100" cy="50" r="8" fill="#D7836C" />
        <circle cx="160" cy="78" r="10" fill="#245C49" opacity="0.85" />
        <rect x="175" y="55" width="28" height="18" rx="6" fill="#DFE8DE" stroke="#245C49" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden>
      <rect width="240" height="140" rx="16" fill="#E8EEEA" />
      <rect x="108" y="20" width="24" height="100" rx="4" fill="#245C49" opacity="0.2" />
      <rect x="114" y="20" width="12" height="100" fill="#245C49" />
      <circle cx="70" cy="50" r="8" fill="#D7836C" />
      <circle cx="55" cy="90" r="6" fill="#245C49" opacity="0.5" />
      <circle cx="175" cy="60" r="7" fill="#D7836C" opacity="0.7" />
      <circle cx="190" cy="95" r="5" fill="#245C49" opacity="0.4" />
      <path d="M80 70 H108" stroke="#245C49" strokeWidth="2" markerEnd="url(#arrow)" />
    </svg>
  )
}
