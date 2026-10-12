/** Selective permeability model — passive transport down a concentration gradient only. */

export type ParticleKind = 'oxygen' | 'water' | 'glucose' | 'sodium'

export interface MembraneToggles {
  glucoseTransporter: boolean
  ionChannel: boolean
}

export interface ParticleSpec {
  id: ParticleKind
  label: string
  symbol: string
  chargeNote?: string
}

export const PARTICLE_SPECS: ParticleSpec[] = [
  { id: 'oxygen', label: 'Oxygen', symbol: 'O₂' },
  { id: 'water', label: 'Water', symbol: 'H₂O' },
  { id: 'glucose', label: 'Glucose', symbol: 'C₆H₁₂O₆' },
  {
    id: 'sodium',
    label: 'Sodium ion',
    symbol: 'Na⁺',
    chargeNote:
      'Real ion movement also depends on electrical potential; this model holds electrical driving force fixed.',
  },
]

export type CrossingRoute =
  | 'bilayer'
  | 'aquaporin'
  | 'transporter'
  | 'channel'
  | 'blocked'

export interface CrossingResult {
  canCross: boolean
  route: CrossingRoute
  relativeRate: number
  explanation: string
}

/**
 * Returns whether a particle can cross passively with the current membrane settings.
 * Gradients are assumed favorable (high → low). No active (against-gradient) transport.
 */
export function canCross(
  kind: ParticleKind,
  toggles: MembraneToggles,
): CrossingResult {
  switch (kind) {
    case 'oxygen':
      return {
        canCross: true,
        route: 'bilayer',
        relativeRate: 1,
        explanation:
          'Small nonpolar O₂ dissolves in the lipid bilayer and diffuses down its concentration gradient.',
      }
    case 'water':
      return {
        canCross: true,
        route: 'aquaporin',
        relativeRate: 0.85,
        explanation:
          'Water can seep slowly through the bilayer, but aquaporins make net water movement much faster.',
      }
    case 'glucose':
      if (toggles.glucoseTransporter) {
        return {
          canCross: true,
          route: 'transporter',
          relativeRate: 0.55,
          explanation:
            'Glucose is polar and large; facilitated diffusion through a transporter allows it to move down its gradient.',
        }
      }
      return {
        canCross: false,
        route: 'blocked',
        relativeRate: 0,
        explanation:
          'Without a glucose transporter, glucose cannot meaningfully cross the bilayer on this timescale.',
      }
    case 'sodium':
      if (toggles.ionChannel) {
        return {
          canCross: true,
          route: 'channel',
          relativeRate: 0.7,
          explanation:
            'Na⁺ needs a selective ion channel. Movement here is passive down its concentration gradient (electrical drive held fixed).',
        }
      }
      return {
        canCross: false,
        route: 'blocked',
        relativeRate: 0,
        explanation:
          'Charged Na⁺ cannot freely cross the hydrophobic bilayer without an open selective channel.',
      }
  }
}

export function summarizePermissions(toggles: MembraneToggles): Record<ParticleKind, CrossingResult> {
  return {
    oxygen: canCross('oxygen', toggles),
    water: canCross('water', toggles),
    glucose: canCross('glucose', toggles),
    sodium: canCross('sodium', toggles),
  }
}

/** Relative flux magnitude for animation/chart (0–1). */
export function fluxMagnitude(
  kind: ParticleKind,
  toggles: MembraneToggles,
  gradientStrength = 1,
): number {
  const result = canCross(kind, toggles)
  if (!result.canCross) return 0
  return result.relativeRate * Math.max(0, Math.min(1, gradientStrength))
}
