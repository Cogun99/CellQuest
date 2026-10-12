import { LAB_STAGES, stageIndex } from '../../lib/labStages'
import type { LabStage } from '../../types/experiments'
import './StageProgress.css'

interface StageProgressProps {
  current: LabStage
  onSelect?: (stage: LabStage) => void
  unlockedThrough: LabStage
}

export function StageProgress({ current, onSelect, unlockedThrough }: StageProgressProps) {
  const unlocked = stageIndex(unlockedThrough)

  return (
    <ol className="stage-progress" aria-label="Lab stages">
      {LAB_STAGES.map((stage, index) => {
        const isCurrent = stage.id === current
        const isUnlocked = index <= unlocked
        return (
          <li key={stage.id} className={isCurrent ? 'is-current' : undefined}>
            <button
              type="button"
              className="stage-progress__btn"
              disabled={!isUnlocked || !onSelect}
              aria-current={isCurrent ? 'step' : undefined}
              onClick={() => onSelect?.(stage.id)}
            >
              <span className="stage-progress__index" aria-hidden>
                {index + 1}
              </span>
              <span>{stage.label}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
