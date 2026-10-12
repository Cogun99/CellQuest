export type ExperimentId = 'osmosis' | 'enzymes' | 'membranes'

export type Difficulty = 'Intro' | 'Intermediate'

export type Topic =
  | 'Transport'
  | 'Homeostasis'
  | 'Macromolecules'
  | 'Membranes'

export type LabStage =
  | 'learn'
  | 'predict'
  | 'experiment'
  | 'explain'
  | 'reflect'

export interface ExperimentMeta {
  id: ExperimentId
  title: string
  subtitle: string
  topic: Topic
  topics: Topic[]
  difficulty: Difficulty
  durationMinutes: number
  summary: string
  learningGoals: string[]
}

export type ExperimentStatus = 'not_started' | 'in_progress' | 'completed'

export interface PredictionOption {
  id: string
  label: string
  correct: boolean
  feedback: string
}

export interface ReflectQuestion {
  id: string
  prompt: string
  options: PredictionOption[]
}
