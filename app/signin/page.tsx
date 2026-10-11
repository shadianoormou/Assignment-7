import { AuthForm } from "@/components/auth-form";
import { Suspense } from "react";

export default function SignInPage() {
  return <section className="auth-page"><Suspense fallback={<div className="loader-ring" aria-label="লোড হচ্ছে" />}><AuthForm mode="signin" /></Suspense></section>;
}
