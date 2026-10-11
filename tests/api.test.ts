import assert from "node:assert/strict";
import { test, mock, afterEach } from "node:test";
import { getProducts, getCategories, getProduct, getCategoryProducts } from "../lib/api";
import type { Product } from "../lib/types";

const product: Product = {
  id: 1, slug: "alu", nameBn: "আলু", category: "sobji", categoryNameBn: "সবজি",
  categoryIcon: "🥬", image: "🥔", unit: "kg", today: 60, yesterday: 62,
  lastWeek: 65, lastMonth: 70, change: { dir: "down", pct: -3.2 },
  markets: [{ market: "কারওয়ান বাজার", division: "ঢাকা", min: 50, max: 70 }],
};

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
  mock.method(globalThis, "fetch", async () => Response.json([product]));
  assert.equal(await getProduct("unknown"), null);
  assert.equal((await getProduct("alu"))?.slug, "alu");
});

test("valid products and categories retain their original API values", async () => {
  mock.method(globalThis, "fetch", async (url: string) => Response.json(url.endsWith("/categories")
    ? [{ id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" }] : [product]));
  assert.deepEqual(await getProducts(), [product]);
  assert.equal((await getCategories())[0].nameBn, "সবজি");
});

test("malformed array entries fail instead of rendering missing or nonnumeric prices", async () => {
  for (const item of [null, { slug: "alu" }, { ...product, today: "৬০" },
    { ...product, change: { dir: "invalid", pct: 0 } },
    { ...product, markets: [{ market: "বাজার", division: "ঢাকা", min: 80, max: 40 }] }]) {
    mock.method(globalThis, "fetch", async () => Response.json([item]));
    await assert.rejects(getProducts, /response format/);
    mock.restoreAll();
  }
});

test("malformed category entries cannot break navigation", async () => {
  mock.method(globalThis, "fetch", async () => Response.json([{ slug: "sobji" }]));
  await assert.rejects(getCategories, /response format/);
});

test("category results remain filtered even if the upstream ignores its filter", async () => {
  mock.method(globalThis, "fetch", async () => Response.json([
    product, { ...product, id: 2, slug: "chal", category: "chal" },
  ]));
  assert.deepEqual(await getCategoryProducts("sobji"), [product]);
  assert.deepEqual(await getCategoryProducts("unknown"), []);
});
