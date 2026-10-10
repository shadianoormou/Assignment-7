import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <EmptyState />;
  }
  return <div className="product-grid">{products.map((product) => <ProductCard product={product} key={product.id} />)}</div>;
}

export function EmptyState({ title = "কোনো পণ্য পাওয়া যায়নি", description = "এই মুহূর্তে এই তালিকায় কোনো পণ্য নেই।" }: { title?: string; description?: string }) {
  return (
    <div className="empty-state">
      <span>🧺</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link href="/" className="solid-button">হোম পেজে ফিরে যান</Link>
    </div>
  );
}
