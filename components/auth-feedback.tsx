"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function AuthFeedback() {
  const params = useSearchParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const handled = useRef(false);
  const success = params.get("auth") === "success";
  useEffect(() => {
    if (success && session?.user && !handled.current) {
      handled.current = true;
      toast.success("স্বাগতম! Social Login সফল হয়েছে");
      router.replace("/");
    }
  }, [success, session?.user, router]);
  return null;
}
