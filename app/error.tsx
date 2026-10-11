"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="auth-page">
      <div className="empty-state" style={{ maxWidth: 560 }}>
        <span>⚠️</span>
        <h1>সাময়িক সমস্যা হয়েছে</h1>
        <p>ডেটা লোড করা যায়নি। আবার চেষ্টা করুন অথবা হোম পেজে ফিরে যান।</p>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <button className="solid-button" onClick={() => reset()}>আবার চেষ্টা করুন</button>
          <Link href="/" className="outline-button">হোম পেজে যান</Link>
        </div>
      </div>
    </section>
  );
}
