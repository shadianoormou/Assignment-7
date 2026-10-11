import assert from "node:assert/strict";
import { test } from "node:test";
import { toProductSummary } from "../lib/product-summary";
import type { Product } from "../lib/types";

test("public cards and category sorting receive only summary fields", () => {
  const product: Product = {
    id: 1, slug: "alu", nameBn: "আলু", category: "sobji", categoryNameBn: "সবজি",
    categoryIcon: "🥬", image: "🥔", unit: "kg", today: 60, yesterday: 62,
    lastWeek: 65, lastMonth: 70, change: { dir: "down", pct: -3.2 },
    markets: [{ market: "কারওয়ান বাজার", division: "ঢাকা", min: 50, max: 70 }],
  };
  const summary = toProductSummary(product);
  assert.deepEqual(Object.keys(summary).sort(), ["change", "id", "image", "nameBn", "slug", "today", "unit"]);
  assert.equal(summary.today, product.today);
  assert.equal(summary.change.dir, "down");
  assert.ok(!JSON.stringify(summary).includes("কারওয়ান বাজার"));
  assert.equal(product.markets.length, 1);
});
