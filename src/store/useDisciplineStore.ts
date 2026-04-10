import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DailyLog {
  date: string // YYYY-MM-DD
  studiedMinutes: number
  minimumMet: boolean
  failed: boolean
}

export interface DisciplineState {
  currentStreak: number
  longestStreak: number
  dailyLogs: Record<string, DailyLog>
  weeklyTargetHours: number

  // Actions
  addStudyTime: (date: string, minutes: number, isWeekend: boolean) => void
  checkDailyRollover: (todayDate: string, yesterdayDate: string, isYesterdayWeekend: boolean) => void
  resetStreak: () => void
}

export const useDisciplineStore = create<DisciplineState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      dailyLogs: {},
      weeklyTargetHours: 30,

      addStudyTime: (date, minutes, isWeekend) => set((state) => {
        const existingLog = state.dailyLogs[date] || { date, studiedMinutes: 0, minimumMet: false, failed: false }
        const newMinutes = existingLog.studiedMinutes + minutes
        const minimumRequired = isWeekend ? 4 * 60 : 2 * 60
        const isMet = newMinutes >= minimumRequired

        const nextLogs = {
          ...state.dailyLogs,
          [date]: {
            ...existingLog,
            studiedMinutes: newMinutes,
            minimumMet: isMet
          }
        }

        let nextStreak = state.currentStreak
        if (isMet && !existingLog.minimumMet) {
          nextStreak += 1
        }

        return {
          dailyLogs: nextLogs,
          currentStreak: nextStreak,
          longestStreak: Math.max(state.longestStreak, nextStreak)
        }
      }),

      checkDailyRollover: (todayDate, yesterdayDate, isYesterdayWeekend) => set((state) => {
        const yesterdayLog = state.dailyLogs[yesterdayDate]
        const todayLog = state.dailyLogs[todayDate]

        let nextStreak = state.currentStreak
        const nextLogs = { ...state.dailyLogs }

        if (!yesterdayLog || !yesterdayLog.minimumMet) {
          // Missed yesterday
          nextStreak = 0
          nextLogs[yesterdayDate] = {
            date: yesterdayDate,
            studiedMinutes: yesterdayLog?.studiedMinutes || 0,
            minimumMet: false,
            failed: true
          }
        }

        if (!nextLogs[todayDate]) {
          nextLogs[todayDate] = { date: todayDate, studiedMinutes: 0, minimumMet: false, failed: false }
        }

        return {
          currentStreak: nextStreak,
          dailyLogs: nextLogs
        }
      }),

      resetStreak: () => set({ currentStreak: 0 })
    }),
    {
      name: 'discipline-storage',
    }
  )
)
