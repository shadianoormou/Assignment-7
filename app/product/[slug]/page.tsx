import { notFound } from "next/navigation";
import { ProtectedProduct } from "@/components/protected-product";
import { getProduct } from "@/lib/api";
import { requireSession } from "@/lib/session";

export const dynamicParams = true;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  await requireSession(`/product/${encodeURIComponent(slug)}`);
  return <ProtectedProduct product={product} />;
}
