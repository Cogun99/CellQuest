import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { EXPERIMENTS } from '../data/experiments'
import { useProgressContext } from '../context/ProgressContext'
import '../components/ui/Button.css'
import './LearningPage.css'

export function LearningPage() {
  const { progress, hasProgress, resetAll, saveNotes } = useProgressContext()

  const completed = EXPERIMENTS.filter(
    (e) => progress.experiments[e.id]?.status === 'completed',
  )
  const concepts = Array.from(
    new Set(
      EXPERIMENTS.flatMap((e) => progress.experiments[e.id]?.concepts ?? []),
    ),
  )
  const continueId =
    progress.lastExperimentId ??
    EXPERIMENTS.find((e) => progress.experiments[e.id]?.status === 'in_progress')?.id ??
    EXPERIMENTS[0]?.id

  return (
    <div className="learning-page">
      <header>
        <h1>My Learning</h1>
        <p>
          A calm record of what you have explored. Everything here is{' '}
          <strong>saved on this device</strong> — there is no account or cloud sync.
        </p>
      </header>

      {!hasProgress ? (
        <div className="learning-empty">
          <h2>No progress yet</h2>
          <p>Enter a lab, make a prediction, and your journey will appear here.</p>
          <Link to="/lab/osmosis" className="cq-btn cq-btn--primary">
            Enter the lab
          </Link>
        </div>
      ) : (
        <>
          <section className="learning-stats" aria-label="Progress summary">
            <div>
              <p className="learning-stats__num">{completed.length}</p>
              <p>Experiments completed</p>
            </div>
            <div>
              <p className="learning-stats__num">{concepts.length}</p>
              <p>Concepts explored</p>
            </div>
            <div>
              <p className="learning-stats__num">
                {EXPERIMENTS.filter((e) => progress.experiments[e.id]).length}
              </p>
              <p>Labs touched</p>
            </div>
          </section>

          {continueId && (
            <section className="learning-continue">
              <h2>Continue learning</h2>
              <p>
                Resume{' '}
                <strong>{EXPERIMENTS.find((e) => e.id === continueId)?.title}</strong>
              </p>
              <Link to={`/lab/${continueId}`} className="cq-btn cq-btn--coral">
                Resume lab
              </Link>
            </section>
          )}

          <section>
            <h2>Experiments</h2>
            <ul className="learning-list">
              {EXPERIMENTS.map((exp) => {
                const entry = progress.experiments[exp.id]
                return (
                  <li key={exp.id}>
                    <div>
                      <h3>{exp.title}</h3>
                      <p>
                        {entry?.status === 'completed'
                          ? 'Completed'
                          : entry?.status === 'in_progress'
                            ? `In progress · stage: ${entry.stage}`
                            : 'Not started'}
                      </p>
                    </div>
                    <Link to={`/lab/${exp.id}`}>Open</Link>
                  </li>
                )
              })}
            </ul>
          </section>

          {concepts.length > 0 && (
            <section>
              <h2>Concepts explored</h2>
              <ul className="learning-concepts">
                {concepts.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2>Saved notes</h2>
            <ul className="learning-notes">
              {EXPERIMENTS.map((exp) => {
                const notes = progress.experiments[exp.id]?.notes ?? ''
                return (
                  <li key={exp.id}>
                    <label htmlFor={`notes-${exp.id}`}>
                      <strong>{exp.title}</strong>
                    </label>
                    <textarea
                      id={`notes-${exp.id}`}
                      rows={3}
                      value={notes}
                      placeholder="Optional notes for yourself…"
                      onChange={(e) => saveNotes(exp.id, e.target.value)}
                    />
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="learning-reset">
            <h2>Reset device progress</h2>
            <p>Clears localStorage for CellQuest on this browser only.</p>
            <Button
              variant="secondary"
              onClick={() => {
                if (
                  window.confirm(
                    'Clear all CellQuest progress saved on this device?',
                  )
                ) {
                  resetAll()
                }
              }}
            >
              Clear progress
            </Button>
          </section>
        </>
      )}
    </div>
  )
}
