"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "./product-grid";

type SortValue = "default" | "asc" | "desc";

export function SortableProducts({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortValue>("default");
  const sorted = useMemo(() => {
    if (sort === "default") return products;
    return [...products].sort((a, b) => sort === "asc" ? a.today - b.today : b.today - a.today);
  }, [products, sort]);

  return (
    <>
      <label className="sort-control">
        <span>সাজান</span>
        <select value={sort} onChange={(event) => setSort(event.target.value as SortValue)} aria-label="পণ্য সাজান">
          <option value="default">ডিফল্ট</option>
          <option value="asc">দাম: কম থেকে বেশি</option>
          <option value="desc">দাম: বেশি থেকে কম</option>
        </select>
        <ChevronDown size={17} />
      </label>
      <ProductGrid products={sorted} />
    </>
  );
}
