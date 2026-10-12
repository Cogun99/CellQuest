import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProgressProvider } from './context/ProgressContext'
import { AboutPage } from './pages/AboutPage'
import { ExperimentsPage } from './pages/ExperimentsPage'
import { HomePage } from './pages/HomePage'
import { LabPage } from './pages/LabPage'
import { LearningPage } from './pages/LearningPage'

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="experiments" element={<ExperimentsPage />} />
            <Route path="lab/:experimentId" element={<LabPage />} />
            <Route path="learning" element={<LearningPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  )
}
