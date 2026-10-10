import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <span className="eyebrow"><span className="eyebrow-dot" /> আজকের বাজারের সর্বশেষ আপডেট</span>
        <h1>আপনার নিত্যদিনের<br /><em>দামদর</em> এক নজরে</h1>
        <p>বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর দেখুন, তুলনা করুন এবং স্মার্ট সিদ্ধান্ত নিন।</p>
        <div className="hero-actions">
          <Link className="solid-button" href="#সব-পণ্য">সব পণ্যের দাম দেখুন <span>↓</span></Link>
          <Link className="outline-button" href="/category/sobji">জনপ্রিয় বাজার <span>↗</span></Link>
        </div>
        <div className="hero-proof"><span className="proof-avatars">👩🏽‍🌾 👨🏽‍🍳</span><span><strong>৩২+</strong> পণ্যের দৈনিক আপডেট</span></div>
      </div>
      <div className="hero-visual">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <Image src="/bazar-hero.png" alt="তাজা বাজারের পণ্য" width={570} height={470} priority className="hero-image" />
        <div className="floating-price-card"><span>আজকের সেরা আপডেট</span><strong>সবজি বাজারে</strong><b>↓ ৪.৮%</b></div>
      </div>
    </section>
  );
}
