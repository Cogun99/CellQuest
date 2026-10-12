import {
  DEFAULT_PROGRESS,
  STORAGE_KEY,
  type ExperimentProgress,
  type ProgressState,
} from '../types/progress'
import type { ExperimentId, LabStage } from '../types/experiments'

function isLabStage(value: unknown): value is LabStage {
  return (
    value === 'learn' ||
    value === 'predict' ||
    value === 'experiment' ||
    value === 'explain' ||
    value === 'reflect'
  )
}

function isExperimentId(value: unknown): value is ExperimentId {
  return value === 'osmosis' || value === 'enzymes' || value === 'membranes'
}

function sanitizeExperiment(raw: unknown): ExperimentProgress | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  const status = obj.status
  if (status !== 'not_started' && status !== 'in_progress' && status !== 'completed') {
    return null
  }
  if (!isLabStage(obj.stage)) return null
  const concepts = Array.isArray(obj.concepts)
    ? obj.concepts.filter((c): c is string => typeof c === 'string')
    : []
  const notes = typeof obj.notes === 'string' ? obj.notes : ''
  const updatedAt =
    typeof obj.updatedAt === 'string' ? obj.updatedAt : new Date().toISOString()

  const progress: ExperimentProgress = {
    status,
    stage: obj.stage,
    concepts,
    notes,
    updatedAt,
  }
  if (typeof obj.predictionCorrect === 'boolean') {
    progress.predictionCorrect = obj.predictionCorrect
  }
  if (typeof obj.reflectScore === 'number' && Number.isFinite(obj.reflectScore)) {
    progress.reflectScore = obj.reflectScore
  }
  return progress
}

export function sanitizeProgress(raw: unknown): ProgressState {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_PROGRESS, experiments: {} }

  const obj = raw as Record<string, unknown>
  const experiments: ProgressState['experiments'] = {}
  const rawExperiments =
    obj.experiments && typeof obj.experiments === 'object'
      ? (obj.experiments as Record<string, unknown>)
      : {}

  for (const [key, value] of Object.entries(rawExperiments)) {
    if (!isExperimentId(key)) continue
    const sanitized = sanitizeExperiment(value)
    if (sanitized) experiments[key] = sanitized
  }

  const last =
    typeof obj.lastExperimentId === 'string' && isExperimentId(obj.lastExperimentId)
      ? obj.lastExperimentId
      : undefined

  return {
    version: 1,
    experiments,
    lastExperimentId: last,
  }
}

export function loadProgress(storage: Storage = localStorage): ProgressState {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROGRESS, experiments: {} }
    return sanitizeProgress(JSON.parse(raw) as unknown)
  } catch {
    return { ...DEFAULT_PROGRESS, experiments: {} }
  }
}

export function saveProgress(
  state: ProgressState,
  storage: Storage = localStorage,
): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearProgress(storage: Storage = localStorage): void {
  try {
    storage.removeItem(STORAGE_KEY)
  } catch {
    // ignore quota / privacy mode failures
  }
}

export function upsertExperimentProgress(
  state: ProgressState,
  id: ExperimentId,
  patch: Partial<ExperimentProgress>,
): ProgressState {
  const current = state.experiments[id] ?? {
    status: 'not_started' as const,
    stage: 'learn' as const,
    concepts: [],
    notes: '',
    updatedAt: new Date().toISOString(),
  }

  const concepts = patch.concepts
    ? Array.from(new Set([...current.concepts, ...patch.concepts]))
    : current.concepts

  return {
    ...state,
    lastExperimentId: id,
    experiments: {
      ...state.experiments,
      [id]: {
        ...current,
        ...patch,
        concepts,
        updatedAt: new Date().toISOString(),
      },
    },
  }
}

export function hasAnyProgress(state: ProgressState): boolean {
  return Object.values(state.experiments).some(
    (e) => e && (e.status !== 'not_started' || e.notes.trim().length > 0),
  )
}
