/** Simplified educational enzyme kinetics (relative units). */

export interface EnzymeParams {
  /** Substrate concentration (relative). */
  substrate: number
  /** Temperature in °C for the illustrative enzyme. */
  temperatureC: number
  /** Michaelis constant (same units as substrate). */
  km: number
  /** Maximum velocity at optimal temperature (relative). */
  vmax: number
  /** Illustrative optimum for this hypothetical enzyme. */
  optimumC: number
  /** Breadth of the temperature response curve. */
  tempSpread: number
  /** Temperature above which function collapses toward zero. */
  denatureC: number
}

export interface EnzymeRateResult {
  rate: number
  saturationFraction: number
  temperatureFactor: number
  status: 'cold-slow' | 'near-optimum' | 'hot-impaired' | 'denatured'
}

export const DEFAULT_ENZYME_PARAMS: EnzymeParams = {
  substrate: 2,
  temperatureC: 37,
  km: 1.5,
  vmax: 1,
  optimumC: 37,
  tempSpread: 14,
  denatureC: 55,
}

/**
 * Saturating substrate response: v = Vmax * [S] / (Km + [S]).
 * This is the same model used by the animation and chart.
 */
export function substrateResponse(substrate: number, km: number, vmax: number): number {
  const s = Math.max(0, substrate)
  return (vmax * s) / (km + s)
}

/**
 * Illustrative temperature factor for a hypothetical enzyme — not a universal optimum.
 * Low temperatures slow the reaction; high temperatures cause loss of function.
 */
export function temperatureFactor(
  temperatureC: number,
  optimumC: number,
  tempSpread: number,
  denatureC: number,
): number {
  if (temperatureC >= denatureC) return 0.02
  const x = (temperatureC - optimumC) / tempSpread
  const gaussian = Math.exp(-0.5 * x * x)
  // Mild cold floor so very cold runs are slow but not zero.
  const coldFloor = temperatureC < optimumC - tempSpread * 1.6 ? 0.08 : 0
  return Math.max(coldFloor, Math.min(1, gaussian))
}

export function classifyTemperature(
  temperatureC: number,
  optimumC: number,
  denatureC: number,
): EnzymeRateResult['status'] {
  if (temperatureC >= denatureC) return 'denatured'
  if (temperatureC >= optimumC + 8) return 'hot-impaired'
  if (temperatureC <= optimumC - 12) return 'cold-slow'
  return 'near-optimum'
}

export function computeEnzymeRate(params: EnzymeParams): EnzymeRateResult {
  const base = substrateResponse(params.substrate, params.km, params.vmax)
  const saturationFraction = base / params.vmax
  const tf = temperatureFactor(
    params.temperatureC,
    params.optimumC,
    params.tempSpread,
    params.denatureC,
  )
  return {
    rate: base * tf,
    saturationFraction,
    temperatureFactor: tf,
    status: classifyTemperature(
      params.temperatureC,
      params.optimumC,
      params.denatureC,
    ),
  }
}

/** Sample saturating curve points for charts (temperature held at optimum). */
export function substrateCurve(
  km: number,
  vmax: number,
  points = 24,
  maxS = 12,
): Array<{ substrate: number; rate: number }> {
  return Array.from({ length: points }, (_, i) => {
    const substrate = (i / (points - 1)) * maxS
    return { substrate, rate: substrateResponse(substrate, km, vmax) }
  })
}

/** Sample illustrative temperature curve (substrate held high). */
export function temperatureCurve(
  params: Pick<EnzymeParams, 'km' | 'vmax' | 'optimumC' | 'tempSpread' | 'denatureC'>,
  substrate = 10,
  points = 28,
  minC = 5,
  maxC = 70,
): Array<{ temperatureC: number; rate: number }> {
  return Array.from({ length: points }, (_, i) => {
    const temperatureC = minC + (i / (points - 1)) * (maxC - minC)
    const result = computeEnzymeRate({
      ...params,
      substrate,
      temperatureC,
    })
    return { temperatureC, rate: result.rate }
  })
}
