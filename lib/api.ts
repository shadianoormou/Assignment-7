import { cache } from "react";
import { API_BASE_URL } from "./constants";
import type { Category, Product } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false;
  return typeof value.id === "number" && Number.isInteger(value.id)
    && [value.slug, value.nameBn, value.category, value.categoryNameBn, value.categoryIcon, value.image].every(isText)
    && ["kg", "litre", "dozen", "piece"].includes(String(value.unit))
    && [value.today, value.yesterday, value.lastWeek, value.lastMonth].every(isPrice)
    && isRecord(value.change) && ["up", "down", "flat"].includes(String(value.change.dir))
    && typeof value.change.pct === "number" && Number.isFinite(value.change.pct)
    && Array.isArray(value.markets) && value.markets.every(market =>
      isRecord(market) && isText(market.market) && isText(market.division)
      && isPrice(market.min) && isPrice(market.max) && market.min <= market.max);
}

function isCategory(value: unknown): value is Category {
  return isRecord(value) && [value.id, value.slug, value.nameBn, value.icon].every(isText);
}

async function apiFetch<T>(path: string, isItem: (value: unknown) => value is T): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isItem)) {
    throw new Error("Unexpected market API response format");
  }
  return data;
}

export const getProducts = cache(async (): Promise<Product[]> => apiFetch("/products", isProduct));

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await apiFetch(`/products?slug=${encodeURIComponent(slug)}`, isProduct);
  return products.find(product => product.slug === slug) ?? null;
}

export const getCategories = cache(async (): Promise<Category[]> => apiFetch("/categories", isCategory));

export async function getCategoryProducts(slug: string): Promise<Product[]> {
  const products = await apiFetch(`/products?category=${encodeURIComponent(slug)}`, isProduct);
  return products.filter(product => product.category === slug);
}
