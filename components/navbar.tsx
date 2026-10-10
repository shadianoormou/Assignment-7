"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FALLBACK_CATEGORIES } from "@/lib/constants";
import { dateInBangla } from "@/lib/format";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("আপনি সফলভাবে সাইন আউট করেছেন");
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  const navLinks = FALLBACK_CATEGORIES.map((category) => ({
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
              <Link className="text-button hide-mobile" href="/signin">
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
        <div className="ticker-track">
          {[...navLinks, ...navLinks].map((category, index) => (
            <span key={`${category.slug}-${index}`} className="ticker-item">
              {category.icon} {category.nameBn} <b>আজকের দর</b> <i>{index % 3 === 0 ? "▲" : "▼"} {index + 1}.২%</i>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
