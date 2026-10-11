import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "./auth";

export async function requireSession(returnPath: string) {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session?.user) {
    redirect(`/signin?reason=protected&callbackUrl=${encodeURIComponent(returnPath)}`);
  }
  return session;
}
