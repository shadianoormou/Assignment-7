import { notFound } from "next/navigation";
import { SortableProducts } from "@/components/sortable-products";
import { getCategories, getCategoryProducts } from "@/lib/api";
import { toProductSummary } from "@/lib/product-summary";

export const dynamicParams = true;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([getCategories(), getCategoryProducts(slug)]);
  const category = categories.find((item) => item.slug === slug);
  if (!category || !products.length) notFound();

  return <section className="category-products"><div className="container"><div className="page-intro"><div><span className="category-icon-large">{category.icon}</span><h1>{category.nameBn}</h1><p>{category.nameBn} ক্যাটাগরির সকল পণ্যের আজকের বাজারদর।</p></div></div><SortableProducts products={products.map(toProductSummary)} /></div></section>;
}
