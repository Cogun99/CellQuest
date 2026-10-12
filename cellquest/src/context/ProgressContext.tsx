import { createContext, useContext, type ReactNode } from 'react'
import { useProgress } from '../hooks/useProgress'

type ProgressApi = ReturnType<typeof useProgress>

const ProgressContext = createContext<ProgressApi | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const api = useProgress()
  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>
}

export function useProgressContext(): ProgressApi {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgressContext must be used within ProgressProvider')
  return ctx
}
