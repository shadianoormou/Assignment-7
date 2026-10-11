"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LoaderCircle, LogIn, LogOut, Menu, UserRound, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FALLBACK_CATEGORIES } from "@/lib/constants";
import { changeLabel, price, unitLabel } from "@/lib/format";
import { authClient } from "@/lib/auth-client";
import type { Category, TickerProduct } from "@/lib/types";

export function Navbar({ categories, tickerProducts, date, tickerUnavailable = false }: { categories: Category[]; tickerProducts: TickerProduct[]; date: string; tickerUnavailable?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const profileMenu = useRef<HTMLDetailsElement>(null);
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            profileMenu.current?.removeAttribute("open");
            toast.success("আপনি সফলভাবে সাইন আউট করেছেন");
            router.push("/");
            router.refresh();
          },
          onError: () => { toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন"); },
        },
      });
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন");
    } finally {
      setSigningOut(false);
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
            <small>{date}</small>
          </span>
        </Link>

        <nav id="category-navigation" className={`category-nav ${mobileOpen ? "is-open" : ""}`} aria-label="ক্যাটাগরি নেভিগেশন">
          {navLinks.map((category) => (
            <Link
              href={category.href}
              key={category.slug}
              className={pathname === category.href ? "active" : ""}
              aria-current={pathname === category.href ? "page" : undefined}
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
            <details className="profile-menu" ref={profileMenu}>
              <summary aria-label="প্রোফাইল মেনু" title={session.user.name || "প্রোফাইল"}>
                <span className="nav-avatar" aria-hidden="true">{session.user.name?.trim().charAt(0) || "U"}</span>
                <span className="profile-name hide-mobile">{session.user.name || "প্রোফাইল"}</span>
                <ChevronDown size={12} aria-hidden="true" />
              </summary>
              <div className="profile-dropdown">
                <p>{session.user.name || "বাজার দর ব্যবহারকারী"}</p>
                <Link href="/profile" onClick={() => profileMenu.current?.removeAttribute("open")}><UserRound size={16} /> আমার প্রোফাইল</Link>
                <button onClick={handleSignOut} disabled={signingOut}>{signingOut ? <LoaderCircle size={16} className="spin" /> : <LogOut size={16} />} সাইন আউট</button>
              </div>
            </details>
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
            aria-label={mobileOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            aria-expanded={mobileOpen}
            aria-controls="category-navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <div className="ticker" aria-label="দামের আপডেট">
        <div className="ticker-track">
          {(tickerProducts.length ? [...tickerProducts, ...tickerProducts] : []).map((product, index) => (
            <Link href={`/product/${product.slug}`} key={`${product.id}-${index}`} className="ticker-item" aria-hidden={index >= tickerProducts.length ? true : undefined} tabIndex={index >= tickerProducts.length ? -1 : undefined}>
              {product.image} {product.nameBn} <b>{price(product.today)} / {unitLabel(product.unit).replace("প্রতি ", "")}</b>{" "}
              <i className={`ticker-change ${product.change.dir}`}>{changeLabel(product.change.dir, product.change.pct)}</i>
            </Link>
          ))}
          {!tickerProducts.length && <span className="ticker-item" role="status">🧺 {tickerUnavailable ? "দামের আপডেট এখন লোড করা যাচ্ছে না। আবার চেষ্টা করুন।" : "বাজারের পণ্যের দাম আপডেট হচ্ছে..."}</span>}
        </div>
      </div>
    </header>
  );
}
