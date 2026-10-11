"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FALLBACK_CATEGORIES } from "@/lib/constants";
import { changeLabel, dateInBangla, price, unitLabel } from "@/lib/format";
import { authClient } from "@/lib/auth-client";
import type { Category, TickerProduct } from "@/lib/types";

export function Navbar({ categories, tickerProducts }: { categories: Category[]; tickerProducts: TickerProduct[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("আপনি সফলভাবে সাইন আউট করেছেন");
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন");
    }
  }

  const navLinks = (categories.length ? categories : FALLBACK_CATEGORIES).map((category) => ({
    ...category,
    href: `/category/${category.slug}`,
  }));

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link href="/" className="brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark">🛒</span>
          <span>
            <strong>বাজার দর</strong>
            <small>{dateInBangla()}</small>
          </span>
        </Link>

        <nav className={`category-nav ${mobileOpen ? "is-open" : ""}`} aria-label="ক্যাটাগরি নেভিগেশন">
          {navLinks.map((category) => (
            <Link
              href={category.href}
              key={category.slug}
              className={pathname === category.href ? "active" : ""}
              onClick={() => setMobileOpen(false)}
            >
              <span>{category.icon}</span> {category.nameBn}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {isPending ? (
            <span className="nav-skeleton" aria-label="লোড হচ্ছে" />
          ) : session?.user ? (
            <>
              <Link className="profile-link" href="/profile">
                <UserRound size={16} />
                <span className="hide-mobile">{session.user.name || "প্রোফাইল"}</span>
              </Link>
              <button className="icon-button" onClick={handleSignOut} aria-label="সাইন আউট">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link className="text-button" href="/signin">
                <LogIn size={16} /> সাইন ইন
              </Link>
              <Link className="solid-button small" href="/signup">
                সাইন আপ
              </Link>
            </>
          )}
          <button
            className="menu-button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="মেনু খুলুন"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <div className="ticker" aria-label="দামের আপডেট">
        <div className="ticker-track" aria-live="polite">
          {(tickerProducts.length ? [...tickerProducts, ...tickerProducts] : []).map((product, index) => (
            <Link href={`/product/${product.slug}`} key={`${product.id}-${index}`} className="ticker-item">
              {product.image} {product.nameBn} <b>{price(product.today)} / {unitLabel(product.unit)}</b>{" "}
              <i>{changeLabel(product.change.dir, product.change.pct)}</i>
            </Link>
          ))}
          {!tickerProducts.length && <span className="ticker-item">🧺 বাজারের পণ্যের দাম আপডেট হচ্ছে...</span>}
        </div>
      </div>
    </header>
  );
}
