import { ProfileView } from "@/components/profile-view";
import { requireSession } from "@/lib/session";

export default async function ProfilePage() {
  await requireSession("/profile");
  return <ProfileView />;
}
