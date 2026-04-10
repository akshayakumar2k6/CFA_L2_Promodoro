"use client"
import { useEffect, useRef } from 'react'
import { usePlannerStore } from '@/store/usePlannerStore'
import { useDisciplineStore } from '@/store/useDisciplineStore'
import { useGamificationStore } from '@/store/useGamificationStore'

interface StoreInitializerProps {
  tasks: any[]
  dailyLogs: any
  stats: any
}

export function StoreInitializer({ tasks, dailyLogs, stats }: StoreInitializerProps) {
  const initialized = useRef(false)
  
  if (!initialized.current) {
    usePlannerStore.setState({ tasks })
    useDisciplineStore.setState({ 
      dailyLogs, 
      currentStreak: stats.currentStreak, 
      longestStreak: stats.longestStreak 
    })
    useGamificationStore.setState({ 
      xp: stats.xp, 
      level: stats.level 
    })
    initialized.current = true
  }

  return null
}
