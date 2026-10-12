import { useEffect, useMemo, useRef, useState } from 'react'
import { Chart } from '../components/ui/Chart'
import { OsmosisScene } from '../components/cells/OsmosisScene'
import { useProgressContext } from '../context/ProgressContext'
import {
  OSMOSIS_PREDICTIONS,
  OSMOSIS_REFLECT,
  getExperiment,
} from '../data/experiments'
import {
  DEFAULT_OSMOSIS_PARAMS,
  createOsmosisState,
  stepOsmosis,
  tonicityLabel,
  waterMovementCopy,
  withExternalConcentration,
} from '../lib/osmosis'
import type { LabStage } from '../types/experiments'
import { LabFrame, PredictionStep, ReflectStep, RunControls } from './LabCommon'
import { stageIndex } from '../lib/labStages'

const CONCEPTS = [
  'Hypotonic / isotonic / hypertonic',
  'Net water movement',
  'Fixed solute amount',
]

export function OsmosisLab() {
  const meta = getExperiment('osmosis')!
  const { progress, setStage, updateExperiment, markCompleted } = useProgressContext()
  const saved = progress.experiments.osmosis

  const [stage, setLocalStage] = useState<LabStage>(saved?.stage ?? 'learn')
  const [unlocked, setUnlocked] = useState<LabStage>(saved?.stage ?? 'learn')
  const [predictionId, setPredictionId] = useState<string | null>(null)
  const [predictionRevealed, setPredictionRevealed] = useState(false)
  const [external, setExternal] = useState(0.4)
  const [running, setRunning] = useState(false)
  const [state, setState] = useState(() =>
    createOsmosisState({ ...DEFAULT_OSMOSIS_PARAMS, externalConcentration: 0.4 }),
  )
  const [history, setHistory] = useState<Array<{ x: number; y: number }>>([
    { x: 0, y: 1 },
  ])
  const [showWhy, setShowWhy] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [completed, setCompleted] = useState(saved?.status === 'completed')
  const raf = useRef<number | null>(null)
  const last = useRef<number>(0)
  const timeRef = useRef(0)

  const go = (next: LabStage) => {
    setLocalStage(next)
    setStage('osmosis', next)
    if (stageIndex(next) > stageIndex(unlocked)) setUnlocked(next)
  }

  useEffect(() => {
    if (!running) {
      if (raf.current) cancelAnimationFrame(raf.current)
      return
    }
    last.current = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000)
      last.current = now
      timeRef.current += dt
      setState((prev) => {
        const next = stepOsmosis(
          prev,
          {
            minVolume: DEFAULT_OSMOSIS_PARAMS.minVolume,
            maxVolume: DEFAULT_OSMOSIS_PARAMS.maxVolume,
            permeability: DEFAULT_OSMOSIS_PARAMS.permeability,
          },
          dt,
        )
        setHistory((h) => {
          const point = { x: timeRef.current, y: next.volume }
          const trimmed = [...h, point]
          return trimmed.length > 120 ? trimmed.slice(-120) : trimmed
        })
        return next
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [running])

  const reset = () => {
    setRunning(false)
    timeRef.current = 0
    setHistory([{ x: 0, y: 1 }])
    setState(
      createOsmosisState({
        ...DEFAULT_OSMOSIS_PARAMS,
        externalConcentration: external,
      }),
    )
  }

  const chartPoints = useMemo(() => history, [history])

  return (
    <LabFrame
      title={meta.title}
      subtitle={meta.summary}
      stage={stage}
      unlockedThrough={unlocked}
      onStage={go}
    >
      {stage === 'learn' && (
        <div className="lab-shell__panel">
          <h2>Learn</h2>
          <p>
            An animal cell has a fixed amount of nonpenetrating solute inside. You choose the
            external solute concentration. Water moves both ways across the membrane, but{' '}
            <strong>net</strong> movement follows the concentration difference.
          </p>
          <ul>
            <li>
              <strong>Hypotonic outside</strong> — lower external solute → net water in → cell
              swells.
            </li>
            <li>
              <strong>Isotonic</strong> — matched concentrations → no net water movement.
            </li>
            <li>
              <strong>Hypertonic outside</strong> — higher external solute → net water out → cell
              shrinks.
            </li>
          </ul>
          <p>
            This is a simplified educational model with relative units and a labeled volume limit.
          </p>
          <div className="lab-shell__actions">
            <button type="button" className="cq-btn cq-btn--primary" onClick={() => go('predict')}>
              Continue to predict
            </button>
          </div>
        </div>
      )}

      {stage === 'predict' && (
        <PredictionStep
          prompt="You place the cell in a dilute (hypotonic) solution. What do you expect?"
          options={OSMOSIS_PREDICTIONS}
          selectedId={predictionId}
          revealed={predictionRevealed}
          onSelect={setPredictionId}
          onContinue={() => {
            if (!predictionRevealed) {
              setPredictionRevealed(true)
              const correct =
                OSMOSIS_PREDICTIONS.find((o) => o.id === predictionId)?.correct ?? false
              updateExperiment('osmosis', { predictionCorrect: correct, status: 'in_progress' })
            } else {
              go('experiment')
            }
          }}
        />
      )}

      {stage === 'experiment' && (
        <>
          <div className="lab-grid">
            <aside className="lab-grid__instructions">
              <h2>Instructions</h2>
              <p>
                Adjust external solute, then Run. Watch volume and the live chart. Reset to start
                fresh.
              </p>
              <p>
                <strong>{tonicityLabel(state.tonicity)}</strong>
              </p>
              <p>{waterMovementCopy(state.netWaterDirection)}</p>
            </aside>
            <div className="lab-grid__stage">
              <OsmosisScene state={state} running={running} />
            </div>
            <aside className="lab-grid__controls">
              <h2>Controls</h2>
              <div className="lab-control">
                <label htmlFor="ext-conc">External solute</label>
                <input
                  id="ext-conc"
                  type="range"
                  min={0.2}
                  max={2.2}
                  step={0.05}
                  value={external}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setExternal(value)
                    setState((s) => withExternalConcentration(s, value))
                  }}
                />
                <span className="lab-control__value">{external.toFixed(2)} relative</span>
              </div>
              <p className="lab-control__value">
                Internal solute amount fixed at{' '}
                {DEFAULT_OSMOSIS_PARAMS.initialInternalConcentration.toFixed(2)} × volume₀
              </p>
              <RunControls
                running={running}
                onRun={() => setRunning(true)}
                onPause={() => setRunning(false)}
                onReset={reset}
                onWhy={() => {
                  setShowWhy(true)
                  go('explain')
                }}
              />
            </aside>
          </div>
          <div className="lab-below">
            <Chart
              title="Cell volume over time"
              xLabel="Time (relative)"
              yLabel="Volume"
              points={chartPoints}
              current={chartPoints[chartPoints.length - 1]}
              yDomain={[
                DEFAULT_OSMOSIS_PARAMS.minVolume - 0.05,
                DEFAULT_OSMOSIS_PARAMS.maxVolume + 0.05,
              ]}
            />
            <div className="lab-shell__panel">
              <h2>Live reading</h2>
              <p>
                Outside {state.externalConcentration.toFixed(2)} vs inside{' '}
                {state.internalConcentration.toFixed(2)}. Volume {state.volume.toFixed(2)}
                {state.atModelLimit ? ' (model limit).' : '.'}
              </p>
              <div className="lab-shell__actions">
                <button
                  type="button"
                  className="cq-btn cq-btn--secondary"
                  onClick={() => go('explain')}
                >
                  Next: Explain
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {stage === 'explain' && (
        <div className="lab-shell__panel">
          <h2>Explain</h2>
          <p>
            Water always moves both ways. The <em>net</em> flow is toward the side with higher
            nonpenetrating solute concentration. Because solute amount inside is fixed, swelling
            dilutes the interior and shrinking concentrates it — until the model hits its volume
            bounds.
          </p>
          <details className="details-block" open={showWhy}>
            <summary>Why did this happen?</summary>
            <p>
              Your external setting of {external.toFixed(2)} made the outside{' '}
              {tonicityLabel(state.tonicity).toLowerCase()}.{' '}
              {waterMovementCopy(state.netWaterDirection)} Isotonic means no{' '}
              <strong>net</strong> movement, not frozen water.
            </p>
          </details>
          <div className="lab-shell__actions">
            <button type="button" className="cq-btn cq-btn--primary" onClick={() => go('reflect')}>
              Continue to reflect
            </button>
          </div>
        </div>
      )}

      {stage === 'reflect' && (
        <ReflectStep
          questions={OSMOSIS_REFLECT}
          answers={answers}
          revealed={revealed}
          onAnswer={(qid, oid) => setAnswers((a) => ({ ...a, [qid]: oid }))}
          onReveal={(qid) => setRevealed((r) => ({ ...r, [qid]: true }))}
          completed={completed}
          onComplete={() => {
            const score = OSMOSIS_REFLECT.reduce((sum, q) => {
              const opt = q.options.find((o) => o.id === answers[q.id])
              return sum + (opt?.correct ? 1 : 0)
            }, 0)
            markCompleted('osmosis', CONCEPTS)
            updateExperiment('osmosis', { reflectScore: score, status: 'completed' })
            setCompleted(true)
          }}
        />
      )}
    </LabFrame>
  )
}
