import { REFERENCES } from '../data/references'
import './AboutPage.css'

export function AboutPage() {
  return (
    <div className="about-page">
      <header>
        <h1>About the Models</h1>
        <p>
          CellQuest teaches core cell biology ideas with simplified, interactive models. The goal
          is clarity for high school learners — not research precision.
        </p>
      </header>

      <section>
        <h2>What CellQuest teaches</h2>
        <ul>
          <li>How concentration differences drive net water movement (osmosis).</li>
          <li>How enzyme rates can saturate with substrate and respond to temperature.</li>
          <li>How membranes are selective: some molecules need transporters or channels.</li>
        </ul>
      </section>

      <section>
        <h2>Simplifications & assumptions</h2>
        <ul>
          <li>
            Quantities use <strong>relative units</strong>. Charts show patterns, not SI laboratory
            values.
          </li>
          <li>
            Osmosis keeps internal solute amount fixed and clamps volume at a labeled model limit.
          </li>
          <li>
            The enzyme temperature curve is for a <strong>hypothetical enzyme</strong> — not a
            universal biological optimum.
          </li>
          <li>
            Membrane transport here is <strong>passive and down-gradient only</strong>. Active
            pumps and complex electrochemistry are out of scope.
          </li>
          <li>
            For Na⁺, electrical driving force is held fixed so learners can focus on channels and
            concentration.
          </li>
        </ul>
      </section>

      <section className="about-page__notice">
        <h2>Educational tool notice</h2>
        <p>
          CellQuest is an educational tool. It is <strong>not medical advice</strong> and{' '}
          <strong>not a research simulator</strong>. Do not use it for clinical decisions or
          experimental design.
        </p>
      </section>

      <section>
        <h2>Further reading</h2>
        <ul className="about-page__refs">
          {REFERENCES.map((ref) => (
            <li key={ref.href}>
              <a href={ref.href} target="_blank" rel="noreferrer noopener">
                {ref.title}
              </a>
              <p>{ref.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
