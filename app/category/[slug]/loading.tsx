import { SkeletonGrid } from "@/components/skeleton-grid";

export default function Loading() {
  return <section className="container section" aria-busy="true" aria-label="ক্যাটাগরির পণ্য লোড হচ্ছে"><SkeletonGrid /></section>;
}
