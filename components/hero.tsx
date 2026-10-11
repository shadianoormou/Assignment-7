import Image from "next/image";
import Link from "next/link";
import { bnNumber } from "@/lib/format";

export function Hero({ productCount }: { productCount: number }) {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <span className="eyebrow"><span className="eyebrow-dot" /> আজকের বাজারের সর্বশেষ আপডেট</span>
        <h1>আজকের বাজারের দাম <em>এক নজরে</em></h1>
        <p>চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
        <div className="hero-actions">
          <Link className="btn solid-button" href="#সব-পণ্য">সব পণ্য দেখুন <span>↓</span></Link>
        </div>
        <div className="hero-proof"><span><strong>{bnNumber(productCount)}</strong> পণ্যের বর্তমান বাজারদর</span></div>
      </div>
      <div className="hero-visual">
        <Image src="/bazar-hero.png" alt="তাজা বাজারের পণ্য" width={570} height={470} priority className="hero-image" />
      </div>
    </section>
  );
}
