import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ToastProvider } from "@/components/toast-provider";
import { getCategories, getProducts } from "@/lib/api";
import { dateInBangla } from "@/lib/format";
import { Suspense } from "react";
import { AuthFeedback } from "@/components/auth-feedback";
import { FALLBACK_CATEGORIES } from "@/lib/constants";
import type { TickerProduct } from "@/lib/types";
import { toProductSummary } from "@/lib/product-summary";
import "./globals.css";

const bengaliFont = Hind_Siliguri({
  subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"],
  variable: "--font-bengali", display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | বাংলাদেশের দৈনিক বাজারদর",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ বাজারদর এক নজরে দেখুন।",
  icons: { icon: "/logo-icon.png" },
};

async function MarketHeader() {
  let categories = FALLBACK_CATEGORIES;
  let tickerProducts: TickerProduct[] = [];
  let tickerUnavailable = false;
  try {
    const [apiCategories, products] = await Promise.all([getCategories(), getProducts()]);
    categories = apiCategories;
    // Do not serialize market-level detail data into the public header.
    tickerProducts = products.map(toProductSummary);
  } catch (error) {
    console.error("Market header unavailable:", error);
    tickerUnavailable = true;
  }
  return <Navbar categories={categories} tickerProducts={tickerProducts} date={dateInBangla()} tickerUnavailable={tickerUnavailable} />;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className={bengaliFont.variable} data-theme="light">
      <body>
        <Suspense fallback={<Navbar categories={FALLBACK_CATEGORIES} tickerProducts={[]} date={dateInBangla()} />}>
          <MarketHeader />
        </Suspense>
        <main>{children}</main>
        <Footer />
        <ToastProvider />
        <Suspense fallback={null}><AuthFeedback /></Suspense>
      </body>
    </html>
  );
}
