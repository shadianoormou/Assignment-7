"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function ProfileUpdateForm() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const [name, setName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const currentSessionName = session?.user?.name ?? "";

  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/signin?callbackUrl=/profile/update");
  }, [isPending, router, session?.user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = (name ?? currentSessionName).trim();
    if (!nextName) {
      toast.error("নাম লিখুন");
      return;
    }
    setSaving(true);
    const result = await authClient.updateUser({ name: nextName });
    if (result.error) {
      toast.error(result.error.message || "তথ্য আপডেট করা যায়নি");
    } else {
      await refetch();
      toast.success("আপনার তথ্য আপডেট হয়েছে");
      router.push("/profile");
    }
    setSaving(false);
  }

  if (isPending || !session?.user) return <div className="container page-loading"><div className="loader-ring" /><p>লোড হচ্ছে...</p></div>;

  return <div className="container profile-page"><div className="profile-card"><div className="profile-content"><Link href="/profile" className="breadcrumb">← প্রোফাইলে ফিরে যান</Link><h2>তথ্য আপডেট করুন</h2><p>আপনার প্রোফাইলে যে নামটি দেখাতে চান তা লিখুন।</p><form className="profile-form" onSubmit={handleSubmit}><label>আপনার নাম<input value={name ?? currentSessionName} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label><button className="solid-button" type="submit" disabled={saving}>{saving && <LoaderCircle className="spin" size={17} />} তথ্য আপডেট করুন</button></form></div></div></div>;
}
