import { Link } from 'react-router-dom'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>
          <strong>CellQuest</strong> is an educational simulation. It is not medical advice
          and not a research-grade simulator.
        </p>
        <p>
          Progress is <span className="site-footer__tag">saved on this device</span>.{' '}
          <Link to="/about">About the models</Link>
        </p>
      </div>
    </footer>
  )
}
