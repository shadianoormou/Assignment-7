import type { Product, ProductSummary } from "./types";

// Public cards and sorting need summary prices, not the protected market table.
export function toProductSummary(product: Product): ProductSummary {
  const { id, slug, nameBn, image, unit, today, change } = product;
  return { id, slug, nameBn, image, unit, today, change };
}
