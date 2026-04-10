"use server"
import { prisma } from "@/lib/prisma"

const GLOBAL_USER_ID = "global-user"

// === FETCH ACTIONS ===
export async function fetchAppState() {
  const tasks = await prisma.task.findMany()
  const dlogs = await prisma.disciplineLog.findMany()
  let stats = await prisma.userStats.findUnique({ where: { id: GLOBAL_USER_ID } })
  
  if (!stats) {
    stats = await prisma.userStats.create({
      data: {
        id: GLOBAL_USER_ID,
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0
      }
    })
  }

  // Convert daily logs to map format used by store
  const dailyLogsMap: Record<string, any> = {}
  dlogs.forEach((l: any) => {
    dailyLogsMap[l.date] = l
  })

  return {
    tasks,
    dailyLogs: dailyLogsMap,
    stats
  }
}

// === PLANNER ACTIONS ===
export async function createTaskDB(data: any) {
  try {
    const task = await prisma.task.create({
      data: {
        date: data.date,
        plannedTime: data.plannedTime || null,
        subject: data.subject,
        tag: data.tag,
        plannedPomodoros: data.plannedPomodoros,
        completedPomodoros: 0,
        isCompleted: false
      }
    })
    return { success: true, task }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function toggleTaskCompletionDB(id: string, isCompleted: boolean) {
  try {
    await prisma.task.update({
      where: { id },
      data: { isCompleted }
    })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function incrementTaskPomodoroDB(id: string, currentCompleted: number, planned: number) {
  try {
    const newCompleted = currentCompleted + 1
    const isCompleted = newCompleted >= planned
    await prisma.task.update({
      where: { id },
      data: { 
        completedPomodoros: newCompleted,
        isCompleted
      }
    })
    return { success: true, newCompleted, isCompleted }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// === DISCIPLINE ACTIONS ===
export async function updateDisciplineLogDB(date: string, studiedMinutes: number, minimumMet: boolean) {
  try {
    const log = await prisma.disciplineLog.upsert({
      where: { date },
      update: {
        studiedMinutes,
        minimumMet
      },
      create: {
        date,
        studiedMinutes,
        minimumMet,
        failed: false
      }
    })
    return { success: true, log }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function setPenaltyDB(date: string) {
  try {
    const log = await prisma.disciplineLog.upsert({
      where: { date },
      update: { failed: true },
      create: { date, failed: true, minimumMet: false, studiedMinutes: 0 }
    })
    return { success: true, log }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// === GAMIFICATION ACTIONS ===
export async function updateStatsDB(data: { xp?: number, level?: number, currentStreak?: number, longestStreak?: number }) {
  try {
    const stats = await prisma.userStats.update({
      where: { id: GLOBAL_USER_ID },
      data
    })
    return { success: true, stats }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function logSessionDB(data: any) {
  try {
    const session = await prisma.sessionLog.create({
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        durationMs: data.durationMs,
        type: data.type,
        rating: data.rating
      }
    })
    return { success: true, session }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
