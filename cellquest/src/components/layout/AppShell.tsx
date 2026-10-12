import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Nav } from './Nav'

export function AppShell() {
  return (
    <div className="app-shell">
      <Nav />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
