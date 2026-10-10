import Link from "next/link";

export default function NotFound() {
  return <section className="auth-page"><div className="empty-state" style={{ maxWidth: 560 }}><span>🧭</span><h1>এই পেজটি খুঁজে পাওয়া যায়নি</h1><p>লিংকটি হয়তো পরিবর্তন হয়েছে অথবা পেজটি আর নেই।</p><Link href="/" className="solid-button">হোম পেজে ফিরে যান</Link></div></section>;
}
