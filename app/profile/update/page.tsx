import { ProfileUpdateForm } from "@/components/profile-update-form";
import { requireSession } from "@/lib/session";

export default async function ProfileUpdatePage() {
  await requireSession("/profile/update");
  return <ProfileUpdateForm />;
}
