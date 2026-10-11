import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

// Run ONLY against a local server with an isolated test database.
const origin = process.env.TEST_APP_URL ?? "http://localhost:3002";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname), "Test writes are restricted to localhost.");
const email = `qa-${randomUUID()}@example.com`;
const password = randomUUID();
let cookie = "";
let passed = 0;

async function request(path, { body, authenticated = false, redirect = "manual" } = {}) {
  const response = await fetch(`${origin}${path}`, {
    method: body ? "POST" : "GET", redirect,
    headers: { Origin: origin, ...(body ? { "Content-Type": "application/json" } : {}), ...(authenticated ? { Cookie: cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const cookies = response.headers.getSetCookie();
  if (cookies.length) cookie = cookies.map(value => value.split(";")[0]).join("; ");
  return response;
}

function pass(label) { passed++; console.log(`PASS ${label}`); }

for (const path of ["/", "/category/sobji", "/signin", "/signup", "/bazar-hero.png"]) {
  assert.equal((await request(path)).status, 200, path);
  pass(`public route ${path}`);
}

for (const path of ["/category/qa-invalid", "/product/qa-invalid", "/qa-invalid"]) {
  const response = await request(path);
  const html = await response.text();
  assert.ok(response.status === 404 || html.includes('name="robots" content="noindex"'), path);
  assert.ok(html.includes("হোম পেজে ফিরে যান"), path);
  pass(`friendly not-found ${path}`);
}

for (const path of ["/product/alu", "/profile", "/profile/update"]) {
  const response = await request(path);
  const html = await response.text();
  const destination = response.headers.get("location") ?? html;
  assert.ok(destination.includes("/signin?reason=protected"), path);
  assert.ok(!html.includes('\\"markets\\"'), "Unauthenticated response must not serialize product market data.");
  pass(`server protected redirect ${path}`);
}

const signUp = await request("/api/auth/sign-up/email", { body: { name: "QA বাজার দর", email, password } });
assert.equal(signUp.status, 200, await signUp.text());
assert.equal(await (await request("/api/auth/get-session", { authenticated: true })).json(), null);
pass("sign-up does not auto-login");

const badLogin = await request("/api/auth/sign-in/email", { body: { email, password: "incorrect-password" } });
assert.equal(badLogin.status, 401);
pass("incorrect password rejected");

const signIn = await request("/api/auth/sign-in/email", { body: { email, password } });
assert.equal(signIn.status, 200, await signIn.text());
assert.ok(cookie.includes("session_token"));
const session = await (await request("/api/auth/get-session", { authenticated: true })).json();
assert.equal(session.user.email, email);
pass("email login and persisted session");

const detail = await request("/product/alu", { authenticated: true });
assert.equal(detail.status, 200);
assert.ok((await detail.text()).includes('\\"markets\\"'));
pass("authenticated detail receives market data on reload");

const update = await request("/api/auth/update-user", { body: { name: "QA আপডেট হয়েছে" }, authenticated: true });
assert.equal(update.status, 200, await update.text());
assert.equal((await (await request("/api/auth/get-session", { authenticated: true })).json()).user.name, "QA আপডেট হয়েছে");
pass("profile name update persists");

const signOut = await request("/api/auth/sign-out", { body: {}, authenticated: true });
assert.equal(signOut.status, 200);
assert.equal(await (await request("/api/auth/get-session", { authenticated: true })).json(), null);
pass("logout clears the session");

console.log(`${passed} checks passed. OAuth and live deployment require separate testing.`);
