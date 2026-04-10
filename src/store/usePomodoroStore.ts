import { create } from 'zustand'
import { logSessionDB } from '@/app/actions'

export interface SessionLog {
  id: string
  startTime: number
  endTime: number
  durationMs: number
  type: 'study' | 'break' | 'mock_exam'
  rating?: number // 1-5
  notes?: string
}

export interface PomodoroState {
  studyDuration: number // minutes
  breakDuration: number // minutes
  isRunning: boolean
  isPaused: boolean
  isHardcoreMode: boolean
  timeLeft: number // seconds
  currentPhase: 'study' | 'break'
  sessionLogs: SessionLog[]
  
  // Actions
  setStudyDuration: (mins: number) => void
  setBreakDuration: (mins: number) => void
  toggleHardcoreMode: () => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  tick: () => void
  completeSession: (rating?: number, notes?: string) => Promise<void>
}

export const usePomodoroStore = create<PomodoroState>()((set, get) => ({
  studyDuration: 50,
  breakDuration: 10,
  isRunning: false,
  isPaused: false,
  isHardcoreMode: false,
  timeLeft: 50 * 60,
  currentPhase: 'study',
  sessionLogs: [],

  setStudyDuration: (mins) => set((state) => ({
    studyDuration: mins,
    timeLeft: state.currentPhase === 'study' && !state.isRunning ? mins * 60 : state.timeLeft
  })),
  
  setBreakDuration: (mins) => set((state) => ({
    breakDuration: mins,
    timeLeft: state.currentPhase === 'break' && !state.isRunning ? mins * 60 : state.timeLeft
  })),

  toggleHardcoreMode: () => set((state) => ({ isHardcoreMode: !state.isHardcoreMode })),

  startTimer: () => set({ isRunning: true, isPaused: false }),

  pauseTimer: () => set((state) => {
    if (state.isHardcoreMode) return {}; 
    return { isRunning: false, isPaused: true }
  }),

  resetTimer: () => set((state) => {
    if (state.isHardcoreMode && state.isRunning) return {}; 
    return {
      isRunning: false,
      isPaused: false,
      timeLeft: state.currentPhase === 'study' ? state.studyDuration * 60 : state.breakDuration * 60
    }
  }),

  tick: () => set((state) => {
    if (!state.isRunning) return {}
    if (state.timeLeft <= 0) {
      return {
        isRunning: false,
        timeLeft: 0
      }
    }
    return { timeLeft: state.timeLeft - 1 }
  }),

  completeSession: async (rating, notes) => {
    const state = get()
    const now = Date.now()
    const durationMins = state.currentPhase === 'study' ? state.studyDuration : state.breakDuration
    
    const dbPayload = {
      startTime: new Date(now - (durationMins * 60 * 1000)),
      endTime: new Date(now),
      durationMs: durationMins * 60 * 1000,
      type: state.currentPhase,
      rating,
      notes
    }

    const log: SessionLog = {
      id: now.toString(),
      startTime: now - (durationMins * 60 * 1000),
      endTime: now,
      durationMs: durationMins * 60 * 1000,
      type: state.currentPhase,
      rating,
      notes
    }

    const nextPhase = state.currentPhase === 'study' ? 'break' : 'study'
    const nextTimeLeft = (nextPhase === 'study' ? state.studyDuration : state.breakDuration) * 60

    set((state) => ({
      currentPhase: nextPhase,
      timeLeft: nextTimeLeft,
      sessionLogs: [...state.sessionLogs, log],
      isRunning: false,
      isPaused: false
    }))

    await logSessionDB(dbPayload)
  }
}))
