import { useMemo, useState } from 'react'
import { MembraneScene } from '../components/cells/MembraneScene'
import { Chart } from '../components/ui/Chart'
import { stageIndex } from '../lib/labStages'
import { useProgressContext } from '../context/ProgressContext'
import {
  MEMBRANE_PREDICTIONS,
  MEMBRANE_REFLECT,
  getExperiment,
} from '../data/experiments'
import {
  PARTICLE_SPECS,
  canCross,
  fluxMagnitude,
  type MembraneToggles,
  type ParticleKind,
} from '../lib/membranes'
import type { LabStage } from '../types/experiments'
import { LabFrame, PredictionStep, ReflectStep, RunControls } from './LabCommon'

const CONCEPTS = [
  'Selective permeability',
  'Facilitated diffusion',
  'Ion channels vs bilayer',
]

export function MembranesLab() {
  const meta = getExperiment('membranes')!
  const { progress, setStage, updateExperiment, markCompleted } = useProgressContext()
  const saved = progress.experiments.membranes

  const [stage, setLocalStage] = useState<LabStage>(saved?.stage ?? 'learn')
  const [unlocked, setUnlocked] = useState<LabStage>(saved?.stage ?? 'learn')
  const [predictionId, setPredictionId] = useState<string | null>(null)
  const [predictionRevealed, setPredictionRevealed] = useState(false)
  const [toggles, setToggles] = useState<MembraneToggles>({
    glucoseTransporter: false,
    ionChannel: false,
  })
  const [highlight, setHighlight] = useState<ParticleKind>('oxygen')
  const [running, setRunning] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [completed, setCompleted] = useState(saved?.status === 'completed')
  const [showWhy, setShowWhy] = useState(false)

  const go = (next: LabStage) => {
    setLocalStage(next)
    setStage('membranes', next)
    if (stageIndex(next) > stageIndex(unlocked)) setUnlocked(next)
  }

  const permissions = useMemo(
    () => PARTICLE_SPECS.map((p) => ({ spec: p, result: canCross(p.id, toggles) })),
    [toggles],
  )

  const chartPoints = useMemo(
    () =>
      PARTICLE_SPECS.map((p, i) => ({
        x: i,
        y: fluxMagnitude(p.id, toggles),
        label: p.symbol,
      })),
    [toggles],
  )

  const focusResult = canCross(highlight, toggles)

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
            Membranes are selective. In this lab, particles only move <strong>passively down</strong>{' '}
            a concentration gradient — never against it.
          </p>
          <ul>
            <li>
              <strong>O₂</strong> crosses the lipid bilayer directly.
            </li>
            <li>
              <strong>Water</strong> moves faster via aquaporins (slow bilayer leak still exists).
            </li>
            <li>
              <strong>Glucose</strong> needs a transporter for facilitated diffusion.
            </li>
            <li>
              <strong>Na⁺</strong> needs a selective channel. Real ions also feel electrical
              potential; this model holds electrical drive fixed.
            </li>
          </ul>
          <div className="lab-shell__actions">
            <button type="button" className="cq-btn cq-btn--primary" onClick={() => go('predict')}>
              Continue to predict
            </button>
          </div>
        </div>
      )}

      {stage === 'predict' && (
        <PredictionStep
          prompt="Which statement best matches selective permeability in this model?"
          options={MEMBRANE_PREDICTIONS}
          selectedId={predictionId}
          revealed={predictionRevealed}
          onSelect={setPredictionId}
          onContinue={() => {
            if (!predictionRevealed) {
              setPredictionRevealed(true)
              const correct =
                MEMBRANE_PREDICTIONS.find((o) => o.id === predictionId)?.correct ?? false
              updateExperiment('membranes', {
                predictionCorrect: correct,
                status: 'in_progress',
              })
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
                Toggle the glucose transporter and Na⁺ channel. Choose a particle to focus.
                Crossing animations only appear when transport is allowed.
              </p>
              <p>
                Focus: <strong>{focusResult.canCross ? focusResult.route : 'blocked'}</strong>
              </p>
            </aside>
            <div className="lab-grid__stage">
              <MembraneScene toggles={toggles} highlight={highlight} running={running} />
            </div>
            <aside className="lab-grid__controls">
              <h2>Controls</h2>
              <div className="toggle-row">
                <label htmlFor="glu">Glucose transporter</label>
                <input
                  id="glu"
                  type="checkbox"
                  checked={toggles.glucoseTransporter}
                  onChange={(e) =>
                    setToggles((t) => ({ ...t, glucoseTransporter: e.target.checked }))
                  }
                />
              </div>
              <div className="toggle-row">
                <label htmlFor="na">Na⁺ ion channel</label>
                <input
                  id="na"
                  type="checkbox"
                  checked={toggles.ionChannel}
                  onChange={(e) => setToggles((t) => ({ ...t, ionChannel: e.target.checked }))}
                />
              </div>
              <div className="lab-control">
                <label htmlFor="particle">Focus particle</label>
                <select
                  id="particle"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value as ParticleKind)}
                >
                  {PARTICLE_SPECS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.symbol} — {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <RunControls
                running={running}
                onRun={() => setRunning(true)}
                onPause={() => setRunning(false)}
                onReset={() => {
                  setRunning(false)
                  setToggles({ glucoseTransporter: false, ionChannel: false })
                  setHighlight('oxygen')
                }}
                onWhy={() => {
                  setShowWhy(true)
                  go('explain')
                }}
              />
            </aside>
          </div>
          <div className="lab-below">
            <Chart
              title="Relative passive flux (favorable gradient)"
              xLabel="Particle index (O₂, H₂O, glucose, Na⁺)"
              yLabel="Relative flux"
              points={chartPoints}
              current={chartPoints.find((p) => PARTICLE_SPECS[p.x]?.id === highlight)}
              xDomain={[-0.2, 3.2]}
              yDomain={[0, 1.05]}
            />
            <div className="lab-shell__panel">
              <h2>Permissions</h2>
              <ul>
                {permissions.map(({ spec, result }) => (
                  <li key={spec.id}>
                    <strong>{spec.symbol}</strong>: {result.explanation}
                  </li>
                ))}
              </ul>
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
            Selectivity comes from chemistry and protein helpers. The bilayer favors small nonpolar
            molecules. Polar glucose and charged Na⁺ need proteins. This lab never moves solutes
            against their gradient.
          </p>
          <details className="details-block" open={showWhy}>
            <summary>Why did this happen?</summary>
            <p>{focusResult.explanation}</p>
            {PARTICLE_SPECS.find((p) => p.id === highlight)?.chargeNote && (
              <p>{PARTICLE_SPECS.find((p) => p.id === highlight)?.chargeNote}</p>
            )}
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
          questions={MEMBRANE_REFLECT}
          answers={answers}
          revealed={revealed}
          onAnswer={(qid, oid) => setAnswers((a) => ({ ...a, [qid]: oid }))}
          onReveal={(qid) => setRevealed((r) => ({ ...r, [qid]: true }))}
          completed={completed}
          onComplete={() => {
            const score = MEMBRANE_REFLECT.reduce((sum, q) => {
              const opt = q.options.find((o) => o.id === answers[q.id])
              return sum + (opt?.correct ? 1 : 0)
            }, 0)
            markCompleted('membranes', CONCEPTS)
            updateExperiment('membranes', { reflectScore: score, status: 'completed' })
            setCompleted(true)
          }}
        />
      )}
    </LabFrame>
  )
}
