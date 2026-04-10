import { create } from 'zustand'

export interface AppSettings {
  examDate: string | null // ISO date string
  soundEnabled: boolean
  defaultStudyMins: number
  defaultBreakMins: number
  dailyMinGoalHours: number
  showXpRules: boolean
  onboardingComplete: boolean
}

export interface SettingsState extends AppSettings {
  setExamDate: (date: string) => void
  setSoundEnabled: (v: boolean) => void
  setDefaultStudyMins: (v: number) => void
  setDefaultBreakMins: (v: number) => void
  setDailyMinGoalHours: (v: number) => void
  setShowXpRules: (v: boolean) => void
  completeOnboarding: () => void
  updateSettings: (s: Partial<AppSettings>) => void
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  examDate: null,
  soundEnabled: true,
  defaultStudyMins: 50,
  defaultBreakMins: 10,
  dailyMinGoalHours: 2,
  showXpRules: true,
  onboardingComplete: false,

  setExamDate: (date) => set({ examDate: date }),
  setSoundEnabled: (v) => set({ soundEnabled: v }),
  setDefaultStudyMins: (v) => set({ defaultStudyMins: v }),
  setDefaultBreakMins: (v) => set({ defaultBreakMins: v }),
  setDailyMinGoalHours: (v) => set({ dailyMinGoalHours: v }),
  setShowXpRules: (v) => set({ showXpRules: v }),
  completeOnboarding: () => set({ onboardingComplete: true }),
  updateSettings: (s) => set((state) => ({ ...state, ...s })),
}))
