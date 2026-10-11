import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ToastProvider } from "@/components/toast-provider";
import { getCategories, getProducts } from "@/lib/api";
import { dateInBangla } from "@/lib/format";
import { Suspense } from "react";
import { AuthFeedback } from "@/components/auth-feedback";
import "./globals.css";

const bengaliFont = Hind_Siliguri({
  subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"],
  variable: "--font-bengali", display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | বাংলাদেশের দৈনিক বাজারদর",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ বাজারদর এক নজরে দেখুন।",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const tickerProducts = products.map(({ id, slug, nameBn, image, unit, today, change }) => ({
    id,
    slug,
    nameBn,
    image,
    unit,
    today,
    change,
  }));

  return (
    <html lang="bn" className={bengaliFont.variable} data-theme="light">
      <body>
        <Navbar categories={categories} tickerProducts={tickerProducts} date={dateInBangla()} />
        <main>{children}</main>
        <Footer />
        <ToastProvider />
        <Suspense fallback={null}><AuthFeedback /></Suspense>
      </body>
    </html>
  );
}
