import type { ReactNode } from 'react'
import { Button } from '../components/ui/Button'
import { StageProgress } from '../components/ui/StageProgress'
import { stageIndex } from '../lib/labStages'
import type { LabStage, PredictionOption, ReflectQuestion } from '../types/experiments'
import './LabShell.css'

interface LabFrameProps {
  title: string
  subtitle: string
  stage: LabStage
  unlockedThrough: LabStage
  onStage: (stage: LabStage) => void
  children: ReactNode
}

export function LabFrame({
  title,
  subtitle,
  stage,
  unlockedThrough,
  onStage,
  children,
}: LabFrameProps) {
  return (
    <div className="lab-shell">
      <header className="lab-shell__header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <StageProgress
          current={stage}
          unlockedThrough={unlockedThrough}
          onSelect={(s) => {
            if (stageIndex(s) <= stageIndex(unlockedThrough)) onStage(s)
          }}
        />
      </header>
      {children}
    </div>
  )
}

interface PredictionStepProps {
  prompt: string
  options: PredictionOption[]
  selectedId: string | null
  revealed: boolean
  onSelect: (id: string) => void
  onContinue: () => void
}

export function PredictionStep({
  prompt,
  options,
  selectedId,
  revealed,
  onSelect,
  onContinue,
}: PredictionStepProps) {
  const selected = options.find((o) => o.id === selectedId)

  return (
    <div className="lab-shell__panel">
      <h2>Make a prediction</h2>
      <p>{prompt}</p>
      <ul className="option-list">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id
          let cls = isSelected ? 'is-selected' : ''
          if (revealed && isSelected) cls += opt.correct ? ' is-correct' : ' is-wrong'
          return (
            <li key={opt.id}>
              <button
                type="button"
                className={cls.trim()}
                disabled={revealed}
                onClick={() => onSelect(opt.id)}
              >
                {opt.label}
              </button>
            </li>
          )
        })}
      </ul>
      {revealed && selected && <p className="feedback">{selected.feedback}</p>}
      <div className="lab-shell__actions">
        {!revealed ? (
          <Button disabled={!selectedId} onClick={onContinue}>
            Check prediction
          </Button>
        ) : (
          <Button onClick={onContinue}>Continue to experiment</Button>
        )}
      </div>
    </div>
  )
}

interface ReflectStepProps {
  questions: ReflectQuestion[]
  answers: Record<string, string>
  revealed: Record<string, boolean>
  onAnswer: (questionId: string, optionId: string) => void
  onReveal: (questionId: string) => void
  onComplete: () => void
  completed: boolean
}

export function ReflectStep({
  questions,
  answers,
  revealed,
  onAnswer,
  onReveal,
  onComplete,
  completed,
}: ReflectStepProps) {
  const allRevealed = questions.every((q) => revealed[q.id])

  return (
    <div className="lab-shell__panel">
      <h2>Reflect</h2>
      <p>Two short checks — honest answers beat speed.</p>
      {questions.map((q) => {
        const selectedId = answers[q.id]
        const isRevealed = revealed[q.id]
        const selected = q.options.find((o) => o.id === selectedId)
        return (
          <div key={q.id} style={{ marginTop: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.65rem' }}>{q.prompt}</h3>
            <ul className="option-list">
              {q.options.map((opt) => {
                const isSelected = selectedId === opt.id
                let cls = isSelected ? 'is-selected' : ''
                if (isRevealed && isSelected) cls += opt.correct ? ' is-correct' : ' is-wrong'
                return (
                  <li key={opt.id}>
                    <button
                      type="button"
                      className={cls.trim()}
                      disabled={isRevealed}
                      onClick={() => onAnswer(q.id, opt.id)}
                    >
                      {opt.label}
                    </button>
                  </li>
                )
              })}
            </ul>
            {!isRevealed ? (
              <div className="lab-shell__actions" style={{ marginTop: '0.75rem' }}>
                <Button disabled={!selectedId} onClick={() => onReveal(q.id)}>
                  Check answer
                </Button>
              </div>
            ) : (
              selected && <p className="feedback">{selected.feedback}</p>
            )}
          </div>
        )
      })}
      <div className="lab-shell__actions" style={{ marginTop: '1.5rem' }}>
        <Button disabled={!allRevealed || completed} onClick={onComplete}>
          {completed ? 'Saved on this device' : 'Save progress'}
        </Button>
      </div>
    </div>
  )
}

export function RunControls({
  running,
  onRun,
  onPause,
  onReset,
  onWhy,
}: {
  running: boolean
  onRun: () => void
  onPause: () => void
  onReset: () => void
  onWhy: () => void
}) {
  return (
    <div className="lab-shell__actions">
      {running ? (
        <Button variant="secondary" onClick={onPause}>
          Pause
        </Button>
      ) : (
        <Button onClick={onRun}>Run</Button>
      )}
      <Button variant="secondary" onClick={onReset}>
        Reset
      </Button>
      <Button variant="ghost" onClick={onWhy}>
        Why did this happen?
      </Button>
      <span className="lab-status">
        <span className={`lab-status__dot${running ? ' is-running' : ''}`} />
        {running ? 'Running' : 'Paused'}
      </span>
    </div>
  )
}
