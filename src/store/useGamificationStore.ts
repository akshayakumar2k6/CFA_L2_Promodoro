import { create } from 'zustand'
import { updateStatsDB } from '@/app/actions'

export interface GamificationState {
  xp: number
  level: number
  
  // Actions
  setGamificationState: (state: Partial<GamificationState>) => void
  addXp: (amount: number) => Promise<void>
}

const XP_PER_LEVEL = 1000

export const useGamificationStore = create<GamificationState>()((set, get) => ({
  xp: 0,
  level: 1,

  setGamificationState: (newState) => set((state) => ({ ...state, ...newState })),

  addXp: async (amount) => {
    const state = get()
    const nextXp = state.xp + amount
    const nextLevel = Math.floor(nextXp / XP_PER_LEVEL) + 1
    
    // Optimistic
    set({ xp: nextXp, level: nextLevel })
    
    // Cloud
    await updateStatsDB({ xp: nextXp, level: nextLevel })
  }
}))
