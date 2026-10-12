/** Simplified educational osmosis model (relative units). */

export type Tonicity = 'hypotonic' | 'isotonic' | 'hypertonic'

export interface OsmosisParams {
  /** External nonpenetrating solute concentration (relative units). */
  externalConcentration: number
  /** Fixed initial internal concentration; solute amount is conserved. */
  initialInternalConcentration: number
  /** Starting cell volume (relative units). */
  initialVolume: number
  /** Soft lower/upper volume bounds for the educational model. */
  minVolume: number
  maxVolume: number
  /** How quickly volume responds to osmotic drive (1/time). */
  permeability: number
}

export interface OsmosisState {
  volume: number
  internalConcentration: number
  externalConcentration: number
  tonicity: Tonicity
  netWaterDirection: -1 | 0 | 1
  atModelLimit: boolean
  soluteAmount: number
}

export const DEFAULT_OSMOSIS_PARAMS: OsmosisParams = {
  externalConcentration: 1,
  initialInternalConcentration: 1,
  initialVolume: 1,
  minVolume: 0.55,
  maxVolume: 1.45,
  permeability: 0.55,
}

export function classifyTonicity(
  external: number,
  internal: number,
  epsilon = 0.02,
): Tonicity {
  const delta = external - internal
  if (Math.abs(delta) <= epsilon) return 'isotonic'
  return delta > 0 ? 'hypertonic' : 'hypotonic'
}

/** Net water direction relative to the cell: +1 in, -1 out, 0 none. */
export function netWaterDirection(
  external: number,
  internal: number,
  epsilon = 0.02,
): -1 | 0 | 1 {
  const tonicity = classifyTonicity(external, internal, epsilon)
  if (tonicity === 'isotonic') return 0
  return tonicity === 'hypotonic' ? 1 : -1
}

export function createOsmosisState(params: OsmosisParams = DEFAULT_OSMOSIS_PARAMS): OsmosisState {
  const soluteAmount = params.initialInternalConcentration * params.initialVolume
  const internal = params.initialInternalConcentration
  return {
    volume: params.initialVolume,
    internalConcentration: internal,
    externalConcentration: params.externalConcentration,
    tonicity: classifyTonicity(params.externalConcentration, internal),
    netWaterDirection: netWaterDirection(params.externalConcentration, internal),
    atModelLimit: false,
    soluteAmount,
  }
}

/**
 * Step the model forward by `dt` (relative time).
 * Solute amount is fixed; concentration = amount / volume.
 * Water flows toward the side with higher solute concentration.
 */
export function stepOsmosis(
  state: OsmosisState,
  params: Pick<OsmosisParams, 'minVolume' | 'maxVolume' | 'permeability'>,
  dt: number,
): OsmosisState {
  const drive = state.internalConcentration - state.externalConcentration
  const unclamped = state.volume + params.permeability * drive * dt
  const volume = Math.min(params.maxVolume, Math.max(params.minVolume, unclamped))
  const atModelLimit = volume === params.minVolume || volume === params.maxVolume
  const internalConcentration = state.soluteAmount / volume
  return {
    ...state,
    volume,
    internalConcentration,
    tonicity: classifyTonicity(state.externalConcentration, internalConcentration),
    netWaterDirection: netWaterDirection(
      state.externalConcentration,
      internalConcentration,
    ),
    atModelLimit,
  }
}

export function withExternalConcentration(
  state: OsmosisState,
  externalConcentration: number,
): OsmosisState {
  return {
    ...state,
    externalConcentration,
    tonicity: classifyTonicity(externalConcentration, state.internalConcentration),
    netWaterDirection: netWaterDirection(
      externalConcentration,
      state.internalConcentration,
    ),
  }
}

export function tonicityLabel(tonicity: Tonicity): string {
  switch (tonicity) {
    case 'hypotonic':
      return 'Hypotonic outside'
    case 'isotonic':
      return 'Isotonic'
    case 'hypertonic':
      return 'Hypertonic outside'
  }
}

export function waterMovementCopy(direction: -1 | 0 | 1): string {
  if (direction === 0) {
    return 'Water still moves both ways, but there is no net water movement.'
  }
  if (direction === 1) {
    return 'Net water movement is into the cell; volume increases.'
  }
  return 'Net water movement is out of the cell; volume decreases.'
}
