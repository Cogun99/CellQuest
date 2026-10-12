import type { LabStage } from '../types/experiments'

export const LAB_STAGES: { id: LabStage; label: string }[] = [
  { id: 'learn', label: 'Learn' },
  { id: 'predict', label: 'Predict' },
  { id: 'experiment', label: 'Experiment' },
  { id: 'explain', label: 'Explain' },
  { id: 'reflect', label: 'Reflect' },
]

const ORDER: LabStage[] = LAB_STAGES.map((s) => s.id)

export function stageIndex(stage: LabStage): number {
  return ORDER.indexOf(stage)
}
