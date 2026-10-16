import { betterAuth } from "better-auth";
import { authOrigin } from "./auth-origin";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getMongoResources } from "./mongodb";

let instance: ReturnType<typeof createAuth> | undefined;

// Initialize at request time so builds do not need a production database.
function createAuth() {
  const production = process.env.NODE_ENV === "production";
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = authOrigin();

  if (production) {
    if (!secret || secret.length < 32 || secret.startsWith("replace-")) {
      throw new Error("Set a random BETTER_AUTH_SECRET of at least 32 characters before deployment.");
    }
    if (!baseURL) throw new Error("Set BETTER_AUTH_URL to the deployed application origin.");
  }

  const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET };
  }
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    socialProviders.github = { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET };
  }
  const { client, database } = getMongoResources();

  return betterAuth({
    database: mongodbAdapter(database, { client }),
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
