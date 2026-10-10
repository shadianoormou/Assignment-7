import { API_BASE_URL, FALLBACK_CATEGORIES } from "./constants";
import type { Category, Product } from "./types";

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getProducts(): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>("/products");
  } catch {
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const product = await apiFetch<Product>(`/products/${encodeURIComponent(slug)}`);
    return product ?? null;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await apiFetch<Category[]>("/categories");
    return categories.length ? categories : FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function getCategoryProducts(slug: string): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>(`/products?category=${encodeURIComponent(slug)}`);
  } catch {
    return [];
  }
}
