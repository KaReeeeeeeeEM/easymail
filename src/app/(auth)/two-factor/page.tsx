import { ShieldCheck } from "lucide-react";

import { TwoFactorForm } from "@/components/auth/two-factor-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TwoFactorPage() {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary"><ShieldCheck className="size-5" /></div>
        <CardTitle>Check your Gmail inbox</CardTitle>
        <CardDescription>Email verification is required every time you sign in.</CardDescription>
      </CardHeader>
      <CardContent><TwoFactorForm /></CardContent>
    </Card>
  );
}
