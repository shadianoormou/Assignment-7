"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { Product } from "@/lib/types";
import { bnNumber, changeLabel, price, productAverage, productMax, productMin, unitLabel } from "@/lib/format";

export function ProtectedProduct({ product }: { product: Product }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("পণ্যের বিস্তারিত দেখতে আগে সাইন ইন করুন");
      router.replace(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, pathname, router, session?.user]);

  if (isPending || !session?.user) {
    return <div className="container page-loading"><div className="loader-ring" /><p>আপনার তথ্য যাচাই করা হচ্ছে...</p></div>;
  }

  return (
    <div className="container detail-page">
      <div className="breadcrumb"><Link href="/">হোম</Link><span>/</span><Link href={`/category/${product.category}`}>{product.categoryNameBn}</Link><span>/</span><b>{product.nameBn}</b></div>
      <section className="detail-hero">
        <div className="detail-intro"><span className="detail-emoji">{product.image}</span><div><span className="eyebrow">{product.categoryIcon} {product.categoryNameBn} বাজারদর</span><h1>{product.nameBn}</h1><p>{product.nameBn} এর আজকের বাজার পরিস্থিতি ও বিভিন্ন বাজারের গড় দাম একসাথে দেখুন।</p><div className="tag-row"><span>{product.categoryIcon} {product.categoryNameBn}</span><span>{unitLabel(product.unit)}</span><span>বাংলাদেশের বাজার</span><span className={`change-badge ${product.change.dir}`}>{changeLabel(product.change.dir, product.change.pct)}</span></div></div></div>
        <div className="detail-today"><small>আজকের দাম</small><strong>{price(product.today)}</strong><span>গতকালের তুলনায় {changeLabel(product.change.dir, product.change.pct)}</span></div>
      </section>
      <div className="stats-grid">
        <div className="stat-card"><span>সর্বনিম্ন দাম</span><strong>{price(productMin(product))}</strong><small>বাজারভেদে</small></div>
        <div className="stat-card featured"><span>গড় দাম</span><strong>{price(productAverage(product))}</strong><small>সব বাজার মিলিয়ে</small></div>
        <div className="stat-card"><span>সর্বোচ্চ দাম</span><strong>{price(productMax(product))}</strong><small>বাজারভেদে</small></div>
      </div>
      <section className="market-section"><div className="section-heading"><div><span className="eyebrow">বাজার অনুযায়ী তুলনা</span><h2>বাজারভিত্তিক আজকের দাম</h2></div><span className="market-count">{bnNumber(product.markets.length)}টি বাজার</span></div><div className="market-table-wrap"><table className="market-table"><thead><tr><th>বাজার</th><th>বিভাগ</th><th>সর্বনিম্ন</th><th>সর্বোচ্চ</th></tr></thead><tbody>{product.markets.map((market) => <tr key={`${market.market}-${market.division}`}><td><strong>{market.market}</strong></td><td><span className="division-pill">{market.division}</span></td><td>{price(market.min)}</td><td>{price(market.max)}</td></tr>)}</tbody></table></div></section>
    </div>
  );
}
