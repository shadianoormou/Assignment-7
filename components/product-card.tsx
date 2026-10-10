import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { changeLabel, price, unitLabel } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="product-card">
      <div className="product-card-top">
        <span className="product-emoji" aria-hidden="true">{product.image}</span>
        <span className="card-arrow"><ArrowUpRight size={17} /></span>
      </div>
      <div className="product-card-copy">
        <div className="product-name-row">
          <h3>{product.nameBn}</h3>
          <span className="category-chip">{product.categoryNameBn}</span>
        </div>
        <p className="muted">{unitLabel(product.unit)}</p>
        <div className="price-row">
          <span>
            <small>আজকের দাম</small>
            <strong>{price(product.today)}</strong>
          </span>
          <span className={`change-badge ${product.change.dir}`}>
            {changeLabel(product.change.dir, product.change.pct)}
          </span>
        </div>
      </div>
    </Link>
  );
}
