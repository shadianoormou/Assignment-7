"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function ProfileView() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/signin?callbackUrl=/profile");
  }, [isPending, router, session?.user]);

  if (isPending || !session?.user) return <div className="container page-loading"><div className="loader-ring" /><p>প্রোফাইল লোড হচ্ছে...</p></div>;
  const initial = session.user.name?.trim().charAt(0) || "U";

  return <div className="container profile-page"><div className="profile-card"><div className="profile-banner"><span className="avatar">{initial}</span><div><h1>{session.user.name || "বাজার দর ব্যবহারকারী"}</h1><p>আপনার বাজারদর প্রোফাইল</p></div></div><div className="profile-content"><h2>ব্যক্তিগত তথ্য</h2><p>আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন এবং প্রয়োজনে আপডেট করুন।</p><div className="profile-details"><div className="profile-detail"><small>নাম</small><strong>{session.user.name || "নাম যোগ করা হয়নি"}</strong></div><div className="profile-detail"><small>ইমেইল</small><strong>{session.user.email}</strong></div></div><Link href="/profile/update" className="solid-button">তথ্য আপডেট করুন <span>↗</span></Link></div></div></div>;
}
