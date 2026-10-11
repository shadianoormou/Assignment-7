import { cache } from "react";
import { API_BASE_URL } from "./constants";
import type { Category, Product } from "./types";

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error("Unexpected market API response format");
  return data as T;
}

export const getProducts = cache(async (): Promise<Product[]> => apiFetch<Product[]>("/products"));

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await apiFetch<Product[]>(`/products?slug=${encodeURIComponent(slug)}`);
  return products.find(product => product.slug === slug) ?? null;
}

export const getCategories = cache(async (): Promise<Category[]> => apiFetch<Category[]>("/categories"));

export async function getCategoryProducts(slug: string): Promise<Product[]> {
  return apiFetch<Product[]>(`/products?category=${encodeURIComponent(slug)}`);
}
