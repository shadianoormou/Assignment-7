import Link from "next/link";
import { changeLabel, price, unitLabel } from "@/lib/format";
import type { ProductSummary } from "@/lib/types";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link href={`/product/${product.slug}`} className="card product-card" aria-label={`${product.nameBn}, ${price(product.today)}, ${unitLabel(product.unit)}`}>
      <div className="product-card-top">
        <span className="product-emoji" aria-hidden="true">{product.image}</span>
        <div>
          <h3>{product.nameBn}</h3>
          <p className="muted">{unitLabel(product.unit)}</p>
        </div>
      </div>
      <div className="product-card-copy">
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
