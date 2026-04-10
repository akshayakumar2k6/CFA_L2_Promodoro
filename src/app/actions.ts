"use server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getSessionUserId(): Promise<string> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    console.error('[actions] No userId in session:', JSON.stringify(session))
    redirect('/login')
  }
  return userId
}

// === FETCH ACTIONS ===
export async function fetchAppState() {
  const session = await auth()
  if (!session?.user?.id) return { tasks: [], dailyLogs: {}, stats: null, settings: null }

  const userId = session.user.id

  const [tasks, dlogs, stats, settings] = await Promise.all([
    prisma.task.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.disciplineLog.findMany({ where: { userId } }),
    prisma.userStats.findUnique({ where: { userId } }),
    prisma.userSetting.findUnique({ where: { userId } }),
  ])

  // Auto-create user defaults on first login
  const resolvedStats = stats ?? await prisma.userStats.create({
    data: { userId, xp: 0, level: 1, currentStreak: 0, longestStreak: 0 }
  })
  const resolvedSettings = settings ?? await prisma.userSetting.create({
    data: { userId }
  })

  const dailyLogsMap: Record<string, any> = {}
  dlogs.forEach((l: any) => { dailyLogsMap[l.date] = l })

  return {
    tasks,
    dailyLogs: dailyLogsMap,
    stats: resolvedStats,
    settings: resolvedSettings,
  }
}

// === PLANNER ACTIONS ===
export async function createTaskDB(data: any) {
  const userId = await getSessionUserId()
  try {
    const task = await prisma.task.create({
      data: {
        userId,
        date: data.date,
        plannedTime: data.plannedTime || null,
        subject: data.subject,
        module: data.module || null,
        tag: data.tag,
        plannedPomodoros: data.plannedPomodoros,
        completedPomodoros: 0,
        isCompleted: false,
      }
    })
    return { success: true, task }
  } catch (err: any) {
    console.error('[createTaskDB]', err.message)
    return { success: false, error: err.message }
  }
}

export async function toggleTaskCompletionDB(id: string, isCompleted: boolean) {
  const userId = await getSessionUserId()
  try {
    await prisma.task.updateMany({ where: { id, userId }, data: { isCompleted } })
    return { success: true }
  } catch (err: any) {
    console.error('[toggleTaskCompletionDB]', err.message)
    return { success: false, error: err.message }
  }
}

export async function incrementTaskPomodoroDB(id: string, currentCompleted: number, planned: number) {
  const userId = await getSessionUserId()
  try {
    const newCompleted = currentCompleted + 1
    const isCompleted = newCompleted >= planned
    await prisma.task.updateMany({
      where: { id, userId },
      data: { completedPomodoros: newCompleted, isCompleted }
    })
    return { success: true, newCompleted, isCompleted }
  } catch (err: any) {
    console.error('[incrementTaskPomodoroDB]', err.message)
    return { success: false, error: err.message }
  }
}

export async function deleteTaskDB(id: string) {
  const userId = await getSessionUserId()
  try {
    await prisma.task.deleteMany({ where: { id, userId } })
    return { success: true }
  } catch (err: any) {
    console.error('[deleteTaskDB]', err.message)
    return { success: false, error: err.message }
  }
}

// === DISCIPLINE ACTIONS ===
export async function updateDisciplineLogDB(date: string, studiedMinutes: number, minimumMet: boolean) {
  const userId = await getSessionUserId()
  try {
    const log = await prisma.disciplineLog.upsert({
      where: { userId_date: { userId, date } },
      update: { studiedMinutes, minimumMet },
      create: { userId, date, studiedMinutes, minimumMet, failed: false }
    })
    return { success: true, log }
  } catch (err: any) {
    console.error('[updateDisciplineLogDB]', err.message)
    return { success: false, error: err.message }
  }
}

export async function setPenaltyDB(date: string) {
  const userId = await getSessionUserId()
  try {
    const log = await prisma.disciplineLog.upsert({
      where: { userId_date: { userId, date } },
      update: { failed: true },
      create: { userId, date, failed: true, minimumMet: false, studiedMinutes: 0 }
    })
    return { success: true, log }
  } catch (err: any) {
    console.error('[setPenaltyDB]', err.message)
    return { success: false, error: err.message }
  }
}

// === GAMIFICATION ACTIONS ===
export async function updateStatsDB(data: { xp?: number, level?: number, currentStreak?: number, longestStreak?: number }) {
  const userId = await getSessionUserId()
  try {
    const stats = await prisma.userStats.upsert({
      where: { userId },
      update: data,
      create: { userId, xp: 0, level: 1, currentStreak: 0, longestStreak: 0, ...data }
    })
    return { success: true, stats }
  } catch (err: any) {
    console.error('[updateStatsDB]', err.message)
    return { success: false, error: err.message }
  }
}

export async function logSessionDB(data: any) {
  const userId = await getSessionUserId()
  try {
    const session = await prisma.sessionLog.create({
      data: {
        userId,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMs: data.durationMs,
        type: data.type,
        rating: data.rating
      }
    })
    return { success: true, session }
  } catch (err: any) {
    console.error('[logSessionDB]', err.message)
    return { success: false, error: err.message }
  }
}

// === SETTINGS ACTIONS ===
export async function updateSettingsDB(data: any) {
  const userId = await getSessionUserId()
  try {
    const settings = await prisma.userSetting.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    })
    return { success: true, settings }
  } catch (err: any) {
    console.error('[updateSettingsDB]', err.message)
    return { success: false, error: err.message }
  }
}

// === PUBLIC SHARE SNAPSHOT ===
export async function getUserShareSnapshot(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      stats: true,
      tasks: { where: { isCompleted: true } },
      disciplineLogs: true,
    }
  })
  if (!user) return null

  const totalStudiedMin = user.disciplineLogs.reduce((a: number, l: any) => a + l.studiedMinutes, 0)
  const streakDays = user.stats?.currentStreak || 0
  const level = user.stats?.level || 1
  const xp = user.stats?.xp || 0
  const completedTasks = user.tasks.length

  return {
    displayName: user.displayName || user.username,
    username: user.username,
    level, xp, streakDays, totalStudiedMin, completedTasks
  }
}
