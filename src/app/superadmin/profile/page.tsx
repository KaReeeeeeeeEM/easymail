import { ShieldCheck, UserRound } from "lucide-react";

import { ProfileForm } from "@/components/dashboard/profile-form";
import { SecuritySettings } from "@/components/dashboard/security-settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireSuperadmin } from "@/lib/superadmin";

export default async function SuperadminProfilePage() {
  const session = await requireSuperadmin();
  const initials =
    session.user.name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SA";
  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <UserRound />
          Account
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Superadmin profile
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Manage your managerial identity, password, and trusted authentication
          devices.
        </p>
      </header>
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <Avatar size="lg">
            <AvatarImage
              src={session.user.image ?? undefined}
              alt={session.user.name}
            />
            <AvatarFallback className="bg-primary/15 font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold">
              {session.user.name}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>
          <Badge>
            <ShieldCheck />
            Super administrator
          </Badge>
        </CardContent>
      </Card>
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">
            <UserRound data-icon="inline-start" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck data-icon="inline-start" />
            Security
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="overview"
          className="max-w-3xl animate-in fade-in duration-200"
        >
          <Card>
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>
                This identity appears in audit events and managerial activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm
                name={session.user.name}
                email={session.user.email}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent
          value="security"
          className="animate-in fade-in duration-200"
        >
          <div className="mb-6 rounded-xl border bg-primary/5 p-4">
            <p className="font-medium text-primary">Superadmin login policy</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Email 2FA is disabled for this managerial account. Password
              changes and optional passkeys remain available below.
            </p>
          </div>
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
