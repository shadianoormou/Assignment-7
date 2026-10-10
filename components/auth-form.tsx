"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const isSignUp = mode === "signup";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();

    if (!email || !password || (isSignUp && !name)) {
      toast.error("সবগুলো প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }
    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);
    if (isSignUp) {
      const result = await authClient.signUp.email({ name, email, password });
      if (result.error) {
        toast.error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
      } else {
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন");
        router.push("/signin");
      }
    } else {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        toast.error(result.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়");
      } else {
        toast.success("স্বাগতম! সাইন ইন সফল হয়েছে");
        router.push("/");
        router.refresh();
      }
    }
    setLoading(false);
  }

  async function handleSocial(provider: "google" | "github") {
    setLoading(true);
    const result = await authClient.signIn.social({ provider, callbackURL: "/" });
    if (result.error) {
      toast.error(`${provider === "google" ? "Google" : "GitHub"} Login সেটআপ করা নেই`);
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-heading"><span className="auth-icon">{isSignUp ? "🌱" : "👋"}</span><p className="eyebrow">বাজার দর-এ স্বাগতম</p><h1>{isSignUp ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "আবার দেখা হয়ে ভালো লাগছে"}</h1><p>{isSignUp ? "আপনার বাজারের হিসাব এক জায়গায় রাখুন।" : "আপনার ড্যাশবোর্ডে যেতে সাইন ইন করুন।"}</p></div>
      <form onSubmit={handleSubmit} className="auth-form">
        {isSignUp && <label>আপনার নাম<input name="name" type="text" placeholder="যেমন: শাদিয়ানূর" autoComplete="name" /></label>}
        <label>ইমেইল<input name="email" type="email" placeholder="you@example.com" autoComplete="email" /></label>
        <label>পাসওয়ার্ড<input name="password" type="password" placeholder="কমপক্ষে ৮ অক্ষর" autoComplete={isSignUp ? "new-password" : "current-password"} /></label>
        <button type="submit" className="solid-button full" disabled={loading}>{loading ? <LoaderCircle className="spin" size={18} /> : null}{isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন করুন"}</button>
      </form>
      <div className="auth-divider"><span>অথবা</span></div>
      <div className="social-buttons">
        <button className="social-button" onClick={() => handleSocial("google")} disabled={loading}><span className="google-g">G</span> Google দিয়ে চালিয়ে যান</button>
        <button className="social-button" onClick={() => handleSocial("github")} disabled={loading}><Github size={18} /> GitHub দিয়ে চালিয়ে যান</button>
      </div>
      <p className="auth-switch">{isSignUp ? "আগেই অ্যাকাউন্ট আছে?" : "নতুন ব্যবহারকারী?"} <Link href={isSignUp ? "/signin" : "/signup"}>{isSignUp ? "সাইন ইন করুন" : "অ্যাকাউন্ট তৈরি করুন"}</Link></p>
    </div>
  );
}
