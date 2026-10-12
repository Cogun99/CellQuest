import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import './Nav.css'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/experiments', label: 'Experiments' },
  { to: '/learning', label: 'My Learning' },
  { to: '/about', label: 'About the Models' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <NavLink to="/" className="site-nav__brand" onClick={() => setOpen(false)}>
          CellQuest
        </NavLink>
        <button
          type="button"
          className="site-nav__toggle"
          aria-expanded={open}
          aria-controls="site-nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
        <nav id="site-nav-menu" className={`site-nav__links ${open ? 'is-open' : ''}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `site-nav__link${isActive ? ' is-active' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
