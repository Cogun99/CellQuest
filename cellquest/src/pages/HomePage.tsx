import { Link } from 'react-router-dom'
import { ExperimentArt } from '../components/cells/ExperimentArt'
import { HeroCell } from '../components/cells/HeroCell'
import { EXPERIMENTS } from '../data/experiments'
import { useProgressContext } from '../context/ProgressContext'
import '../components/ui/Button.css'
import './HomePage.css'

export function HomePage() {
  const { progress, hasProgress } = useProgressContext()
  const continueId = progress.lastExperimentId ?? EXPERIMENTS[0]?.id
  const continueMeta = EXPERIMENTS.find((e) => e.id === continueId)

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero__copy">
          <p className="home-hero__brand">CellQuest</p>
          <h1 id="home-hero-title">Small cells. Big discoveries.</h1>
          <p className="home-hero__support">
            Explore living systems through interactive experiments. Make a prediction, change a
            variable, and discover what happens.
          </p>
          <div className="home-hero__actions">
            <Link to="/lab/osmosis" className="cq-btn cq-btn--primary home-hero__link-btn">
              Enter the lab
            </Link>
            <Link to="/experiments" className="cq-btn cq-btn--secondary home-hero__link-btn">
              Explore experiments
            </Link>
          </div>
        </div>
        <HeroCell />
      </section>

      {hasProgress && continueMeta && (
        <section className="home-continue" aria-labelledby="continue-title">
          <div>
            <h2 id="continue-title">Continue learning</h2>
            <p>
              Pick up <strong>{continueMeta.title}</strong> — progress is saved on this device.
            </p>
          </div>
          <Link to={`/lab/${continueMeta.id}`} className="cq-btn cq-btn--coral">
            Resume
          </Link>
        </section>
      )}

      <section className="home-flow" aria-labelledby="flow-title">
        <h2 id="flow-title">How every experiment works</h2>
        <p className="section-lead">
          A calm loop that builds understanding before you tweak the model.
        </p>
        <ol className="home-flow__steps">
          <li>
            <span>1</span>
            <div>
              <strong>Predict</strong>
              <p>Commit to an idea before you see the outcome.</p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>Experiment</strong>
              <p>Change one variable and watch the living system respond.</p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>Understand</strong>
              <p>Read a clear explanation tied to the same model you just ran.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="home-featured" aria-labelledby="featured-title">
        <h2 id="featured-title">Featured experiments</h2>
        <p className="section-lead">Three complete labs — start any of them in two clicks.</p>
        <ul className="home-featured__list">
          {EXPERIMENTS.map((exp) => {
            const status = progress.experiments[exp.id]?.status ?? 'not_started'
            return (
              <li key={exp.id}>
                <Link to={`/lab/${exp.id}`} className="home-featured__item">
                  <ExperimentArt id={exp.id} className="home-featured__art" />
                  <div>
                    <p className="home-featured__meta">
                      {exp.topic} · {exp.difficulty} · {exp.durationMinutes} min
                    </p>
                    <h3>{exp.title}</h3>
                    <p>{exp.summary}</p>
                    <p className="home-featured__status">
                      {status === 'completed'
                        ? 'Completed'
                        : status === 'in_progress'
                          ? 'In progress'
                          : 'Not started'}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
