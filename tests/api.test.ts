import assert from "node:assert/strict";
import { test, mock, afterEach } from "node:test";
import { getProducts, getCategories, getProduct, getCategoryProducts } from "../lib/api";

afterEach(() => mock.restoreAll());

test("API outage is not silently converted to an empty list or a 404", async () => {
  mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  for (const read of [getProducts, getCategories, () => getProduct("alu"), () => getCategoryProducts("sobji")]) {
    await assert.rejects(read, /503/);
  }
});

test("malformed API payload produces a useful error", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({ message: "unexpected" }));
  await assert.rejects(getProducts, /response format/);
});

test("unknown product stays not-found even if the upstream ignores its filter", async () => {
  mock.method(globalThis, "fetch", async () => Response.json([{ slug: "alu" }]));
  assert.equal(await getProduct("unknown"), null);
  assert.equal((await getProduct("alu"))?.slug, "alu");
});
