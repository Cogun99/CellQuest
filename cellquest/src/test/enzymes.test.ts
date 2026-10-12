import { describe, expect, it } from 'vitest'
import {
  computeEnzymeRate,
  substrateResponse,
  temperatureFactor,
} from '../lib/enzymes'

describe('enzyme model', () => {
  it('saturates as substrate increases', () => {
    const low = substrateResponse(0.3, 1.5, 1)
    const mid = substrateResponse(1.5, 1.5, 1)
    const high = substrateResponse(12, 1.5, 1)
    expect(mid).toBeGreaterThan(low)
    expect(high).toBeGreaterThan(mid)
    expect(high).toBeLessThan(1)
    expect(high).toBeGreaterThan(0.85)
    const higher = substrateResponse(40, 1.5, 1)
    expect(higher - high).toBeLessThan(0.1)
  })

  it('slows at cold temperatures and collapses when denatured', () => {
    const cold = temperatureFactor(10, 37, 14, 55)
    const opt = temperatureFactor(37, 37, 14, 55)
    const hot = temperatureFactor(60, 37, 14, 55)
    expect(cold).toBeLessThan(opt)
    expect(opt).toBeCloseTo(1, 5)
    expect(hot).toBeLessThan(0.05)
  })

  it('combines substrate and temperature into one relative rate', () => {
    const result = computeEnzymeRate({
      substrate: 10,
      temperatureC: 37,
      km: 1.5,
      vmax: 1,
      optimumC: 37,
      tempSpread: 14,
      denatureC: 55,
    })
    expect(result.rate).toBeGreaterThan(0.8)
    expect(result.status).toBe('near-optimum')

    const denatured = computeEnzymeRate({
      substrate: 10,
      temperatureC: 62,
      km: 1.5,
      vmax: 1,
      optimumC: 37,
      tempSpread: 14,
      denatureC: 55,
    })
    expect(denatured.rate).toBeLessThan(0.05)
    expect(denatured.status).toBe('denatured')
  })
})
