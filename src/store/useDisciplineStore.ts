import { create } from 'zustand'
import { updateDisciplineLogDB, setPenaltyDB, updateStatsDB } from '@/app/actions'

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
  setDisciplineState: (state: Partial<DisciplineState>) => void
  addStudyTime: (date: string, minutes: number, isWeekend: boolean) => Promise<void>
  checkDailyRollover: (todayDate: string, yesterdayDate: string, isYesterdayWeekend: boolean) => Promise<void>
  resetStreak: () => Promise<void>
}

export const useDisciplineStore = create<DisciplineState>()((set, get) => ({
  currentStreak: 0,
  longestStreak: 0,
  dailyLogs: {},
  weeklyTargetHours: 30,

  setDisciplineState: (newState) => set((state) => ({ ...state, ...newState })),

  addStudyTime: async (date, minutes, isWeekend) => {
    const state = get()
    const existingLog = state.dailyLogs[date] || { date, studiedMinutes: 0, minimumMet: false, failed: false }
    const newMinutes = existingLog.studiedMinutes + minutes
    const minimumRequired = isWeekend ? 4 * 60 : 2 * 60
    const isMet = newMinutes >= minimumRequired

    const nextLogs = {
      ...state.dailyLogs,
      [date]: { ...existingLog, studiedMinutes: newMinutes, minimumMet: isMet }
    }

    let nextStreak = state.currentStreak
    if (isMet && !existingLog.minimumMet) {
      nextStreak += 1
    }
    const nextLongest = Math.max(state.longestStreak, nextStreak)

    // Optimistic Update
    set({
      dailyLogs: nextLogs,
      currentStreak: nextStreak,
      longestStreak: nextLongest
    })

    // Cloud Fire
    await updateDisciplineLogDB(date, newMinutes, isMet)
    if (nextStreak > state.currentStreak) {
      await updateStatsDB({ currentStreak: nextStreak, longestStreak: nextLongest })
    }
  },

  checkDailyRollover: async (todayDate, yesterdayDate, isYesterdayWeekend) => {
    const state = get()
    const yesterdayLog = state.dailyLogs[yesterdayDate]
    const todayLog = state.dailyLogs[todayDate]

    let nextStreak = state.currentStreak
    const nextLogs = { ...state.dailyLogs }
    let missedYesterday = false

    if (!yesterdayLog || !yesterdayLog.minimumMet) {
      nextStreak = 0
      nextLogs[yesterdayDate] = {
        date: yesterdayDate,
        studiedMinutes: yesterdayLog?.studiedMinutes || 0,
        minimumMet: false,
        failed: true
      }
      missedYesterday = true
    }

    if (!nextLogs[todayDate]) {
      nextLogs[todayDate] = { date: todayDate, studiedMinutes: 0, minimumMet: false, failed: false }
    }

    set({
      currentStreak: nextStreak,
      dailyLogs: nextLogs
    })

    if (missedYesterday) {
      await setPenaltyDB(yesterdayDate)
      await updateStatsDB({ currentStreak: 0 })
    }
  },

  resetStreak: async () => {
    set({ currentStreak: 0 })
    await updateStatsDB({ currentStreak: 0 })
  }
}))
