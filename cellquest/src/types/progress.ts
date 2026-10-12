import type { ExperimentId, ExperimentStatus, LabStage } from './experiments'

export interface ExperimentProgress {
  status: ExperimentStatus
  stage: LabStage
  concepts: string[]
  notes: string
  predictionCorrect?: boolean
  reflectScore?: number
  updatedAt: string
}

export interface ProgressState {
  version: 1
  experiments: Partial<Record<ExperimentId, ExperimentProgress>>
  lastExperimentId?: ExperimentId
}

export const STORAGE_KEY = 'cellquest-progress-v1'

export const DEFAULT_PROGRESS: ProgressState = {
  version: 1,
  experiments: {},
}
