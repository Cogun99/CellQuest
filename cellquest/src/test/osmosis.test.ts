import { describe, expect, it } from 'vitest'
import {
  classifyTonicity,
  createOsmosisState,
  netWaterDirection,
  stepOsmosis,
  withExternalConcentration,
} from '../lib/osmosis'

describe('osmosis model', () => {
  it('classifies hypotonic, isotonic, and hypertonic outside', () => {
    expect(classifyTonicity(0.5, 1)).toBe('hypotonic')
    expect(classifyTonicity(1, 1)).toBe('isotonic')
    expect(classifyTonicity(1.5, 1)).toBe('hypertonic')
  })

  it('moves water into the cell in hypotonic conditions', () => {
    let state = createOsmosisState({
      externalConcentration: 0.4,
      initialInternalConcentration: 1,
      initialVolume: 1,
      minVolume: 0.55,
      maxVolume: 1.45,
      permeability: 0.8,
    })
    expect(netWaterDirection(state.externalConcentration, state.internalConcentration)).toBe(1)
    for (let i = 0; i < 40; i++) {
      state = stepOsmosis(
        state,
        { minVolume: 0.55, maxVolume: 1.45, permeability: 0.8 },
        0.05,
      )
    }
    expect(state.volume).toBeGreaterThan(1)
    expect(state.internalConcentration).toBeLessThan(1)
  })

  it('moves water out in hypertonic conditions', () => {
    let state = createOsmosisState({
      externalConcentration: 1.8,
      initialInternalConcentration: 1,
      initialVolume: 1,
      minVolume: 0.55,
      maxVolume: 1.45,
      permeability: 0.8,
    })
    expect(state.netWaterDirection).toBe(-1)
    for (let i = 0; i < 40; i++) {
      state = stepOsmosis(
        state,
        { minVolume: 0.55, maxVolume: 1.45, permeability: 0.8 },
        0.05,
      )
    }
    expect(state.volume).toBeLessThan(1)
  })

  it('has no net water movement when isotonic', () => {
    const state = withExternalConcentration(createOsmosisState(), 1)
    expect(state.tonicity).toBe('isotonic')
    expect(state.netWaterDirection).toBe(0)
    const next = stepOsmosis(
      state,
      { minVolume: 0.55, maxVolume: 1.45, permeability: 0.8 },
      0.05,
    )
    expect(next.volume).toBeCloseTo(state.volume, 5)
  })

  it('respects model volume limits', () => {
    let state = createOsmosisState({
      externalConcentration: 0.1,
      initialInternalConcentration: 1,
      initialVolume: 1,
      minVolume: 0.55,
      maxVolume: 1.2,
      permeability: 2,
    })
    for (let i = 0; i < 80; i++) {
      state = stepOsmosis(state, { minVolume: 0.55, maxVolume: 1.2, permeability: 2 }, 0.05)
    }
    expect(state.volume).toBeLessThanOrEqual(1.2)
    expect(state.atModelLimit).toBe(true)
  })
})
