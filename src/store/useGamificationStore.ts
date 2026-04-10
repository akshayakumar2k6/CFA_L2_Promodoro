import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GamificationState {
  xp: number
  level: number
  
  // Actions
  addXp: (amount: number) => void
}

const XP_PER_LEVEL = 1000

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      xp: 0,
      level: 1,

      addXp: (amount) => set((state) => {
        const nextXp = state.xp + amount
        const nextLevel = Math.floor(nextXp / XP_PER_LEVEL) + 1
        return { xp: nextXp, level: nextLevel }
      })
    }),
    {
      name: 'gamification-storage',
    }
  )
)
