import Link from "next/link";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/api";
import { changeLabel, price } from "@/lib/format";
import type { Product } from "@/lib/types";

function MiniProduct({ product }: { product: Product }) {
  return <Link href={`/product/${product.slug}`} className="mini-product"><div className="mini-top"><span className="mini-emoji">{product.image}</span><span className={`change-badge ${product.change.dir}`}>{changeLabel(product.change.dir, product.change.pct)}</span></div><h3>{product.nameBn}</h3><p>{product.categoryNameBn}</p><strong>{price(product.today)}</strong></Link>;
}

export default async function HomePage() {
  const products = await getProducts();
  const risers = [...products].filter((product) => product.change.dir === "up").sort((a, b) => b.change.pct - a.change.pct).slice(0, 6);
  const fallers = [...products].filter((product) => product.change.dir === "down").sort((a, b) => a.change.pct - b.change.pct).slice(0, 6);

  return <>
    <Hero />
    <section className="highlight-strip container">
      <div className="section-heading"><div><span className="eyebrow"><ArrowUp size={14} /> দামের গতি</span><h2>আজ দাম বেড়েছে</h2></div><span className="section-title-icon">▲</span></div>
      <div className="highlight-grid">{risers.map((product) => <MiniProduct key={product.id} product={product} />)}</div>
    </section>
    <section className="section soft">
      <div className="container"><div className="section-heading"><div><span className="eyebrow"><ArrowDown size={14} /> স্বস্তির খবর</span><h2>আজ দাম কমেছে</h2></div><span className="section-title-icon">▼</span></div><div className="highlight-grid">{fallers.map((product) => <MiniProduct key={product.id} product={product} />)}</div></div>
    </section>
    <section className="section" id="সব-পণ্য">
      <div className="container"><div className="section-heading"><div><span className="eyebrow">সবকিছু এক জায়গায়</span><h2>সব পণ্য</h2><p>বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের আপডেটেড দাম।</p></div><Link href="/category/sobji" className="outline-button">ক্যাটাগরি দেখুন ↗</Link></div><ProductGrid products={products} /></div>
    </section>
  </>;
}
