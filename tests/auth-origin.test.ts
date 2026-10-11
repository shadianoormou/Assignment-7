import assert from "node:assert/strict";
import test from "node:test";
import { authOrigin } from "../lib/auth-origin";

test("explicit authentication origin takes precedence", () => {
  assert.equal(authOrigin({ BETTER_AUTH_URL: "https://bazar.example", VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "other.vercel.app" }), "https://bazar.example");
});

test("Vercel production uses the stable production domain", () => {
  assert.equal(authOrigin({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "bazar.vercel.app" }), "https://bazar.vercel.app");
});

test("preview and local environments never implicitly use the production origin", () => {
  assert.equal(authOrigin({ VERCEL_ENV: "preview", VERCEL_PROJECT_PRODUCTION_URL: "bazar.vercel.app" }), undefined);
  assert.equal(authOrigin({}), undefined);
});
