import { Suspense } from "react";
import { MailCheck } from "lucide-react";

import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyEmailPage() {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary"><MailCheck className="size-5" /></div>
        <CardTitle>Verify your Gmail address</CardTitle>
        <CardDescription>Your account remains inactive until this code confirms the inbox belongs to you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="flex flex-col gap-3"><Skeleton className="h-11 w-full" /><Skeleton className="h-9 w-full" /></div>}><VerifyEmailForm /></Suspense>
      </CardContent>
    </Card>
  );
}
