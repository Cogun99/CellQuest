import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExperimentArt } from '../components/cells/ExperimentArt'
import { EXPERIMENTS } from '../data/experiments'
import { useProgressContext } from '../context/ProgressContext'
import type { Topic } from '../types/experiments'
import './ExperimentsPage.css'

const FILTERS: Array<'All' | Topic> = [
  'All',
  'Transport',
  'Homeostasis',
  'Macromolecules',
  'Membranes',
]

export function ExperimentsPage() {
  const { progress } = useProgressContext()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  const list = useMemo(() => {
    if (filter === 'All') return EXPERIMENTS
    return EXPERIMENTS.filter((e) => e.topics.includes(filter))
  }, [filter])

  return (
    <div className="experiments-page">
      <header className="experiments-page__header">
        <h1>Experiment library</h1>
        <p>
          Three fully working labs. Filter by topic, then open a simulation — no account needed.
        </p>
      </header>

      <div className="experiments-page__filters" role="group" aria-label="Topic filters">
        {FILTERS.map((topic) => (
          <button
            key={topic}
            type="button"
            className={`filter-chip${filter === topic ? ' is-active' : ''}`}
            aria-pressed={filter === topic}
            onClick={() => setFilter(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="experiments-page__empty">No experiments match this topic.</p>
      ) : (
        <ul className="experiments-page__list">
          {list.map((exp) => {
            const status = progress.experiments[exp.id]?.status ?? 'not_started'
            return (
              <li key={exp.id}>
                <article className="exp-card">
                  <ExperimentArt id={exp.id} className="exp-card__art" />
                  <div className="exp-card__body">
                    <p className="exp-card__meta">
                      {exp.topic} · {exp.difficulty} · {exp.durationMinutes} min
                    </p>
                    <h2>{exp.title}</h2>
                    <p className="exp-card__subtitle">{exp.subtitle}</p>
                    <p>{exp.summary}</p>
                    <p className="exp-card__status">
                      Progress:{' '}
                      {status === 'completed'
                        ? 'Completed'
                        : status === 'in_progress'
                          ? 'In progress'
                          : 'Not started'}
                    </p>
                    <Link className="exp-card__cta" to={`/lab/${exp.id}`}>
                      Open lab
                    </Link>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
