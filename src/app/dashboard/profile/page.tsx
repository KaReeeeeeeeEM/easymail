import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return <div className="flex max-w-3xl flex-col gap-8"><PageHeading eyebrow="Account" title="Profile" description="Manage the personal information attached to your account." /><Card><CardHeader><CardTitle>Personal information</CardTitle><CardDescription>This name appears in your dashboard and security emails.</CardDescription></CardHeader><CardContent><ProfileForm name={session.user.name} email={session.user.email} /></CardContent></Card></div>;
}
