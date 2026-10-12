import { describe, expect, it } from 'vitest'
import { canCross, fluxMagnitude } from '../lib/membranes'

describe('membrane transport permissions', () => {
  it('allows O₂ through the bilayer always', () => {
    const off = canCross('oxygen', { glucoseTransporter: false, ionChannel: false })
    expect(off.canCross).toBe(true)
    expect(off.route).toBe('bilayer')
  })

  it('allows water via aquaporin pathway', () => {
    const water = canCross('water', { glucoseTransporter: false, ionChannel: false })
    expect(water.canCross).toBe(true)
    expect(water.route).toBe('aquaporin')
  })

  it('blocks glucose without a transporter and allows with one', () => {
    const blocked = canCross('glucose', { glucoseTransporter: false, ionChannel: false })
    const open = canCross('glucose', { glucoseTransporter: true, ionChannel: false })
    expect(blocked.canCross).toBe(false)
    expect(blocked.route).toBe('blocked')
    expect(open.canCross).toBe(true)
    expect(open.route).toBe('transporter')
  })

  it('blocks Na⁺ without a channel and allows with one', () => {
    const blocked = canCross('sodium', { glucoseTransporter: false, ionChannel: false })
    const open = canCross('sodium', { glucoseTransporter: false, ionChannel: true })
    expect(blocked.canCross).toBe(false)
    expect(open.canCross).toBe(true)
    expect(open.route).toBe('channel')
  })

  it('reports zero flux when blocked', () => {
    expect(fluxMagnitude('glucose', { glucoseTransporter: false, ionChannel: true })).toBe(0)
    expect(fluxMagnitude('sodium', { glucoseTransporter: true, ionChannel: false })).toBe(0)
    expect(fluxMagnitude('oxygen', { glucoseTransporter: false, ionChannel: false })).toBeGreaterThan(
      0,
    )
  })
})
