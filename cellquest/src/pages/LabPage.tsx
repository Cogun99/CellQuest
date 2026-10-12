import { Link, useParams } from 'react-router-dom'
import { EnzymesLab } from '../experiments/EnzymesLab'
import { MembranesLab } from '../experiments/MembranesLab'
import { OsmosisLab } from '../experiments/OsmosisLab'
import type { ExperimentId } from '../types/experiments'

function isExperimentId(value: string | undefined): value is ExperimentId {
  return value === 'osmosis' || value === 'enzymes' || value === 'membranes'
}

export function LabPage() {
  const { experimentId } = useParams()

  if (!isExperimentId(experimentId)) {
    return (
      <div className="lab-shell__panel">
        <h1>Lab not found</h1>
        <p>That experiment id is not part of CellQuest.</p>
        <Link to="/experiments">Back to experiments</Link>
      </div>
    )
  }

  if (experimentId === 'osmosis') return <OsmosisLab />
  if (experimentId === 'enzymes') return <EnzymesLab />
  return <MembranesLab />
}
