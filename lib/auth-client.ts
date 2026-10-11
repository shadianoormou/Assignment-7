"use client";

import { createAuthClient } from "better-auth/react";

// BetterAuth defaults to the current origin, including deployed domains.
export const authClient = createAuthClient();
