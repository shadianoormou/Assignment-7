import { SkeletonGrid } from "@/components/skeleton-grid";

export default function Loading() {
  return <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">আজকের বাজার</span><h2>দাম লোড হচ্ছে...</h2></div></div><SkeletonGrid /></div></section>;
}
