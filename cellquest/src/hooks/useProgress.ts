import { useCallback, useEffect, useState } from 'react'
import {
  clearProgress,
  hasAnyProgress,
  loadProgress,
  saveProgress,
  upsertExperimentProgress,
} from '../lib/storage'
import type { ExperimentId, LabStage } from '../types/experiments'
import type { ExperimentProgress, ProgressState } from '../types/progress'

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const updateExperiment = useCallback(
    (id: ExperimentId, patch: Partial<ExperimentProgress>) => {
      setProgress((prev) => upsertExperimentProgress(prev, id, patch))
    },
    [],
  )

  const setStage = useCallback((id: ExperimentId, stage: LabStage) => {
    setProgress((prev) =>
      upsertExperimentProgress(prev, id, {
        stage,
        status: stage === 'learn' ? 'in_progress' : 'in_progress',
      }),
    )
  }, [])

  const markCompleted = useCallback((id: ExperimentId, concepts: string[]) => {
    setProgress((prev) =>
      upsertExperimentProgress(prev, id, {
        status: 'completed',
        stage: 'reflect',
        concepts,
      }),
    )
  }, [])

  const saveNotes = useCallback((id: ExperimentId, notes: string) => {
    setProgress((prev) =>
      upsertExperimentProgress(prev, id, {
        notes,
        status: prev.experiments[id]?.status ?? 'in_progress',
      }),
    )
  }, [])

  const resetAll = useCallback(() => {
    clearProgress()
    setProgress({ version: 1, experiments: {} })
  }, [])

  return {
    progress,
    updateExperiment,
    setStage,
    markCompleted,
    saveNotes,
    resetAll,
    hasProgress: hasAnyProgress(progress),
  }
}
