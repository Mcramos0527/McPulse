import { create } from 'zustand'

interface AnalysisState {
  currentAnalysisId: string | null
  progress: { stage: string; step: number; total: number } | null
  setAnalysisId: (id: string) => void
  setProgress: (p: AnalysisState['progress']) => void
  reset: () => void
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysisId: null,
  progress: null,
  setAnalysisId: (id) => set({ currentAnalysisId: id }),
  setProgress: (progress) => set({ progress }),
  reset: () => set({ currentAnalysisId: null, progress: null }),
}))
