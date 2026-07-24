import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient across hot-reloads in dev.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Run a query with a few retries, falling back to a default if it still fails.
 * Serverless Postgres (Neon/Vercel) can be suspended and take a few seconds to
 * wake — this keeps build-time prerendering from failing on a cold database.
 * ISR then fills in real data on the next request once the DB is warm.
 */
export async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T,
  retries = 4,
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) {
        console.error("safeQuery: falling back after retries", err);
        return fallback;
      }
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return fallback;
}
