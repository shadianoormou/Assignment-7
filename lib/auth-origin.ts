export function authOrigin(env: Readonly<Record<string, string | undefined>> = process.env) {
  if (env.BETTER_AUTH_URL) return env.BETTER_AUTH_URL;
  // Use the stable production domain, never a request Host header or preview URL.
  if (env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return undefined;
}
