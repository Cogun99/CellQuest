import { useMemo, useState } from 'react'
import { EnzymeScene } from '../components/cells/EnzymeScene'
import { Chart } from '../components/ui/Chart'
import { stageIndex } from '../lib/labStages'
import { useProgressContext } from '../context/ProgressContext'
import {
  ENZYME_PREDICTIONS,
  ENZYME_REFLECT,
  getExperiment,
} from '../data/experiments'
import {
  DEFAULT_ENZYME_PARAMS,
  computeEnzymeRate,
  substrateCurve,
  temperatureCurve,
} from '../lib/enzymes'
import type { LabStage } from '../types/experiments'
import { LabFrame, PredictionStep, ReflectStep, RunControls } from './LabCommon'

const CONCEPTS = [
  'Enzyme saturation',
  'Illustrative temperature curve',
  'Relative reaction rate',
]

export function EnzymesLab() {
  const meta = getExperiment('enzymes')!
  const { progress, setStage, updateExperiment, markCompleted } = useProgressContext()
  const saved = progress.experiments.enzymes

  const [stage, setLocalStage] = useState<LabStage>(saved?.stage ?? 'learn')
  const [unlocked, setUnlocked] = useState<LabStage>(saved?.stage ?? 'learn')
  const [predictionId, setPredictionId] = useState<string | null>(null)
  const [predictionRevealed, setPredictionRevealed] = useState(false)
  const [substrate, setSubstrate] = useState(DEFAULT_ENZYME_PARAMS.substrate)
  const [temperatureC, setTemperatureC] = useState(DEFAULT_ENZYME_PARAMS.temperatureC)
  const [running, setRunning] = useState(false)
  const [chartMode, setChartMode] = useState<'substrate' | 'temperature'>('substrate')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [completed, setCompleted] = useState(saved?.status === 'completed')
  const [showWhy, setShowWhy] = useState(false)

  const result = useMemo(
    () =>
      computeEnzymeRate({
        ...DEFAULT_ENZYME_PARAMS,
        substrate,
        temperatureC,
      }),
    [substrate, temperatureC],
  )

  const go = (next: LabStage) => {
    setLocalStage(next)
    setStage('enzymes', next)
    if (stageIndex(next) > stageIndex(unlocked)) setUnlocked(next)
  }

  const subCurve = useMemo(
    () =>
      substrateCurve(DEFAULT_ENZYME_PARAMS.km, DEFAULT_ENZYME_PARAMS.vmax).map((p) => ({
        x: p.substrate,
        y: p.rate * result.temperatureFactor,
      })),
    [result.temperatureFactor],
  )

  const tempCurve = useMemo(
    () =>
      temperatureCurve(DEFAULT_ENZYME_PARAMS, Math.max(substrate, 8)).map((p) => ({
        x: p.temperatureC,
        y: p.rate,
      })),
    [substrate],
  )

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
            Enzymes speed reactions. In this model, rate follows a saturating substrate response
            (Michaelis–Menten style) multiplied by an <strong>illustrative</strong> temperature
            factor for a hypothetical enzyme.
          </p>
          <ul>
            <li>Low substrate → rate rises quickly as you add more.</li>
            <li>High substrate → enzymes saturate; the curve flattens toward Vmax.</li>
            <li>Cold slows activity; high heat impairs function in this hypothetical curve.</li>
          </ul>
          <p>The animation and charts use the same equations — relative units only.</p>
          <div className="lab-shell__actions">
            <button type="button" className="cq-btn cq-btn--primary" onClick={() => go('predict')}>
              Continue to predict
            </button>
          </div>
        </div>
      )}

      {stage === 'predict' && (
        <PredictionStep
          prompt="As substrate concentration becomes very high, what happens to reaction rate?"
          options={ENZYME_PREDICTIONS}
          selectedId={predictionId}
          revealed={predictionRevealed}
          onSelect={setPredictionId}
          onContinue={() => {
            if (!predictionRevealed) {
              setPredictionRevealed(true)
              const correct =
                ENZYME_PREDICTIONS.find((o) => o.id === predictionId)?.correct ?? false
              updateExperiment('enzymes', { predictionCorrect: correct, status: 'in_progress' })
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
                Change substrate and temperature independently. Run animates collisions; Pause
                freezes them. Charts match the model.
              </p>
              <p>
                Saturation {Math.round(result.saturationFraction * 100)}% · temp factor{' '}
                {result.temperatureFactor.toFixed(2)}
              </p>
            </aside>
            <div className="lab-grid__stage">
              <EnzymeScene
                substrate={substrate}
                temperatureC={temperatureC}
                result={result}
                running={running}
              />
            </div>
            <aside className="lab-grid__controls">
              <h2>Controls</h2>
              <div className="lab-control">
                <label htmlFor="substrate">Substrate concentration</label>
                <input
                  id="substrate"
                  type="range"
                  min={0.1}
                  max={12}
                  step={0.1}
                  value={substrate}
                  onChange={(e) => setSubstrate(Number(e.target.value))}
                />
                <span className="lab-control__value">{substrate.toFixed(1)} relative</span>
              </div>
              <div className="lab-control">
                <label htmlFor="temp">Temperature</label>
                <input
                  id="temp"
                  type="range"
                  min={5}
                  max={70}
                  step={1}
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(Number(e.target.value))}
                />
                <span className="lab-control__value">{temperatureC.toFixed(0)}°C</span>
              </div>
              <div className="lab-control">
                <label htmlFor="chart-mode">Chart mode</label>
                <select
                  id="chart-mode"
                  value={chartMode}
                  onChange={(e) =>
                    setChartMode(e.target.value as 'substrate' | 'temperature')
                  }
                >
                  <option value="substrate">Substrate response</option>
                  <option value="temperature">Temperature curve</option>
                </select>
              </div>
              <RunControls
                running={running}
                onRun={() => setRunning(true)}
                onPause={() => setRunning(false)}
                onReset={() => {
                  setRunning(false)
                  setSubstrate(DEFAULT_ENZYME_PARAMS.substrate)
                  setTemperatureC(DEFAULT_ENZYME_PARAMS.temperatureC)
                }}
                onWhy={() => {
                  setShowWhy(true)
                  go('explain')
                }}
              />
            </aside>
          </div>
          <div className="lab-below">
            {chartMode === 'substrate' ? (
              <Chart
                title="Saturating substrate response (at current temperature factor)"
                xLabel="Substrate"
                yLabel="Relative rate"
                points={subCurve}
                current={{ x: substrate, y: result.rate }}
                xDomain={[0, 12]}
                yDomain={[0, 1.05]}
              />
            ) : (
              <Chart
                title="Hypothetical enzyme temperature curve"
                xLabel="Temperature °C"
                yLabel="Relative rate"
                points={tempCurve}
                current={{ x: temperatureC, y: result.rate }}
                xDomain={[5, 70]}
                yDomain={[0, 1.05]}
              />
            )}
            <div className="lab-shell__panel">
              <h2>Live reading</h2>
              <p>
                Relative rate <strong>{result.rate.toFixed(2)}</strong> from the same model as the
                animation. Assumptions: single hypothetical enzyme; electrical/chemical complexity
                omitted; educational relative units.
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
            Rate = saturating substrate term × temperature factor. As substrate rises, free enzyme
            becomes scarce, so the curve approaches a maximum. The temperature curve is labeled
            hypothetical: cold slows; near the illustrative optimum activity is higher; high heat
            collapses function.
          </p>
          <details className="details-block" open={showWhy}>
            <summary>Why did this happen?</summary>
            <p>
              At substrate {substrate.toFixed(1)} and {temperatureC.toFixed(0)}°C, the model yields
              rate {result.rate.toFixed(2)} ({result.status.replace('-', ' ')}). Changing either
              control updates both the scene and the chart together.
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
          questions={ENZYME_REFLECT}
          answers={answers}
          revealed={revealed}
          onAnswer={(qid, oid) => setAnswers((a) => ({ ...a, [qid]: oid }))}
          onReveal={(qid) => setRevealed((r) => ({ ...r, [qid]: true }))}
          completed={completed}
          onComplete={() => {
            const score = ENZYME_REFLECT.reduce((sum, q) => {
              const opt = q.options.find((o) => o.id === answers[q.id])
              return sum + (opt?.correct ? 1 : 0)
            }, 0)
            markCompleted('enzymes', CONCEPTS)
            updateExperiment('enzymes', { reflectScore: score, status: 'completed' })
            setCompleted(true)
          }}
        />
      )}
    </LabFrame>
  )
}
