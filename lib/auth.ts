import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute } from "node:path";

let instance: ReturnType<typeof createAuth> | undefined;

// Initialize at request time so builds do not need a production database.
function createAuth() {
  const production = process.env.NODE_ENV === "production";
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL;
  const databaseURL = process.env.DATABASE_URL;
  const sqlitePath = process.env.BETTER_AUTH_DB_PATH ?? "data/auth.db";

  if (production) {
    if (!secret || secret.length < 32 || secret.startsWith("replace-")) {
      throw new Error("Set a random BETTER_AUTH_SECRET of at least 32 characters before deployment.");
    }
    if (!baseURL) throw new Error("Set BETTER_AUTH_URL to the deployed application origin.");
    if (!databaseURL && (!isAbsolute(sqlitePath) || process.env.VERCEL || process.env.NETLIFY)) {
      throw new Error("Use DATABASE_URL for serverless hosting, or an absolute SQLite path on a persistent volume.");
    }
  }

  const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET };
  }
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    socialProviders.github = { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET };
  }
  if (!databaseURL) mkdirSync(dirname(sqlitePath), { recursive: true });

  return betterAuth({
    database: databaseURL ? new Pool({ connectionString: databaseURL, max: 5 }) : new Database(sqlitePath),
    secret: secret ?? "bazar-dor-local-development-secret-change-me",
    baseURL: baseURL ?? "http://localhost:3000",
    emailAndPassword: { enabled: true, autoSignIn: false },
    socialProviders,
    trustedOrigins: [baseURL ?? "http://localhost:3000"],
  });
}

export function getAuth() {
  return instance ??= createAuth();
}
