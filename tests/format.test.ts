import assert from "node:assert/strict";
import { test } from "node:test";
import { bnNumber, changeLabel, dateInBangla, productAverage, productMin, productMax } from "../lib/format";
import type { Product } from "../lib/types";

test("prices and flat changes use Bengali digits", () => {
  assert.equal(bnNumber(1850), "১,৮৫০");
  assert.equal(changeLabel("flat", 0), "— ০.০%");
  assert.equal(changeLabel("down", -12.4), "▼ ১২.৪%");
});

test("Bangla date uses Dhaka timezone without grouping the year", () => {
  const date = dateInBangla(new Date("2026-10-10T20:30:00Z"));
  assert.ok(date.includes("১১"));
  assert.ok(date.includes("২০২৬"));
  assert.ok(!date.includes("২,০২৬"));
});

test("market min and max do not include an unrelated today price", () => {
  const product = { today: 5, markets: [{ market: "ক", division: "ঢাকা", min: 20, max: 40 }, { market: "খ", division: "ঢাকা", min: 30, max: 50 }] } as Product;
  assert.equal(productMin(product), 20);
  assert.equal(productMax(product), 50);
  assert.equal(productAverage(product), 35);
  assert.equal(productMin({ ...product, markets: [] }), 5);
});
