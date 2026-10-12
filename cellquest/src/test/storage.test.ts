import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearProgress,
  hasAnyProgress,
  loadProgress,
  sanitizeProgress,
  saveProgress,
  upsertExperimentProgress,
} from '../lib/storage'
import { STORAGE_KEY } from '../types/progress'

class MemoryStorage implements Storage {
  private data = new Map<string, string>()
  get length() {
    return this.data.size
  }
  clear() {
    this.data.clear()
  }
  getItem(key: string) {
    return this.data.has(key) ? (this.data.get(key) as string) : null
  }
  key(index: number) {
    return Array.from(this.data.keys())[index] ?? null
  }
  removeItem(key: string) {
    this.data.delete(key)
  }
  setItem(key: string, value: string) {
    this.data.set(key, value)
  }
}

describe('progress persistence', () => {
  let storage: MemoryStorage

  beforeEach(() => {
    storage = new MemoryStorage()
  })

  it('returns empty progress when nothing is stored', () => {
    expect(loadProgress(storage)).toEqual({ version: 1, experiments: {} })
  })

  it('round-trips experiment progress', () => {
    const next = upsertExperimentProgress(
      { version: 1, experiments: {} },
      'osmosis',
      {
        status: 'in_progress',
        stage: 'experiment',
        concepts: ['Net water movement'],
        notes: 'try hypotonic',
      },
    )
    expect(saveProgress(next, storage)).toBe(true)
    const loaded = loadProgress(storage)
    expect(loaded.experiments.osmosis?.stage).toBe('experiment')
    expect(loaded.experiments.osmosis?.notes).toBe('try hypotonic')
    expect(loaded.lastExperimentId).toBe('osmosis')
    expect(hasAnyProgress(loaded)).toBe(true)
  })

  it('sanitizes corrupt payloads instead of crashing', () => {
    storage.setItem(STORAGE_KEY, '{not-json')
    expect(loadProgress(storage)).toEqual({ version: 1, experiments: {} })

    const cleaned = sanitizeProgress({
      version: 99,
      lastExperimentId: 'nope',
      experiments: {
        osmosis: { status: 'completed', stage: 'reflect', concepts: ['x'], notes: 12 },
        weird: { status: 'completed', stage: 'reflect', concepts: [], notes: '' },
      },
    })
    expect(cleaned.version).toBe(1)
    expect(cleaned.lastExperimentId).toBeUndefined()
    expect(cleaned.experiments.osmosis?.notes).toBe('')
    expect(cleaned.experiments).not.toHaveProperty('weird')
  })

  it('clears device progress', () => {
    saveProgress(
      {
        version: 1,
        experiments: {
          enzymes: {
            status: 'completed',
            stage: 'reflect',
            concepts: [],
            notes: '',
            updatedAt: new Date().toISOString(),
          },
        },
      },
      storage,
    )
    clearProgress(storage)
    expect(loadProgress(storage).experiments).toEqual({})
  })
})
