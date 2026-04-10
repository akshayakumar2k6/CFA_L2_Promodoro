'use server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function registerUser(username: string, password: string, displayName?: string) {
  // Validate
  if (!username || username.length < 3) return { error: 'Username must be at least 3 characters' }
  if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return { error: 'Username can only contain letters, numbers, and underscores' }

  const exists = await prisma.user.findUnique({ where: { username } })
  if (exists) return { error: 'Username already taken' }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      displayName: displayName || username,
      stats: { create: {} },
      settings: { create: {} },
    },
  })

  return { success: true, userId: user.id }
}
