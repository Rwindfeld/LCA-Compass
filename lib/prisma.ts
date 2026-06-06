import { PrismaClient } from "../generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db"
  const adapter = new PrismaBetterSqlite3({ url })
  return new PrismaClient({ adapter })
}

/** Bump when Report/document fields change so dev hot-reload picks up prisma generate. */
const PRISMA_CLIENT_CACHE_KEY = "prisma_v3_product_member"

function getPrismaClient(): PrismaClient {
  const cache = globalForPrisma as typeof globalForPrisma & {
    [PRISMA_CLIENT_CACHE_KEY]?: PrismaClient
  }

  if (process.env.NODE_ENV === "production") {
    if (!cache[PRISMA_CLIENT_CACHE_KEY]) {
      cache[PRISMA_CLIENT_CACHE_KEY] = createPrismaClient()
    }
    return cache[PRISMA_CLIENT_CACHE_KEY]
  }

  // Dev: avoid stale client after `prisma generate` / migrations (global cache kept old Report shape).
  if (!cache[PRISMA_CLIENT_CACHE_KEY]) {
    cache[PRISMA_CLIENT_CACHE_KEY] = createPrismaClient()
  }
  return cache[PRISMA_CLIENT_CACHE_KEY]
}

export const prisma = getPrismaClient()
