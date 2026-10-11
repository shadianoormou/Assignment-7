import { getAuth } from "./lib/auth";

// Migrations use the direct endpoint; runtime DATABASE_URL stays pooled.
if (process.env.DATABASE_URL_UNPOOLED) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED;
}

export const auth = getAuth();
