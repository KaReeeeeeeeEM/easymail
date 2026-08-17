import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { SecuritySettings } from "@/components/dashboard/security-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return <div className="flex flex-col gap-8"><PageHeading eyebrow="Account" title="Profile" description="Manage your personal information and authentication security." /><Tabs defaultValue="overview"><TabsList variant="line"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger></TabsList><TabsContent value="overview" className="max-w-3xl animate-in fade-in duration-200"><Card><CardHeader><CardTitle>Personal information</CardTitle><CardDescription>This name appears in your dashboard and security emails.</CardDescription></CardHeader><CardContent><ProfileForm name={session.user.name} email={session.user.email} /></CardContent></Card></TabsContent><TabsContent value="security" className="animate-in fade-in duration-200"><SecuritySettings /></TabsContent></Tabs></div>;
}
