import { prisma } from "@invoice/db";

import { ProfileForm } from "@/components/profile/profile-form";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Update your business information and defaults.
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
