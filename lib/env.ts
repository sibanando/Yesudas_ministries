const required = ["DATABASE_URL", "ADMIN_SESSION_SECRET"] as const;

// Skip validation during Next.js build — env vars are only available at runtime
if (process.env.NEXT_PHASE !== "phase-production-build") {
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
