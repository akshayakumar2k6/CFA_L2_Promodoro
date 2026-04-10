"use client"
import { useRef } from 'react'
import { usePlannerStore } from '@/store/usePlannerStore'
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { useGamificationStore } from '@/store/useGamificationStore'
import { useSettingsStore } from '@/store/useSettingsStore'

interface StoreInitializerProps {
  tasks: any[]
  dailyLogs: any
  stats: any
  settings?: any
}

export function StoreInitializer({ tasks, dailyLogs, stats, settings }: StoreInitializerProps) {
  const initialized = useRef(false)
  
  if (!initialized.current) {
    usePlannerStore.setState({ tasks })
    useDisciplineStore.setState({ 
      dailyLogs: dailyLogs || {}, 
      currentStreak: stats?.currentStreak || 0, 
      longestStreak: stats?.longestStreak || 0 
    })
    useGamificationStore.setState({ 
      xp: stats?.xp || 0, 
      level: stats?.level || 1 
    })
    if (settings) {
      useSettingsStore.setState({ 
        examDate: settings.examDate || null,
        soundEnabled: settings.soundEnabled ?? true,
        defaultStudyMins: settings.defaultStudyMins ?? 50,
        defaultBreakMins: settings.defaultBreakMins ?? 10,
        dailyMinGoalHours: settings.dailyMinGoalHours ?? 2,
        showXpRules: settings.showXpRules ?? true,
        onboardingComplete: true, // logged-in users skip onboarding
      })
    }
    initialized.current = true
  }

  return null
}
