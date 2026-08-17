import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";

import { TemporaryPasswordForm } from "@/components/auth/temporary-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function ChangeTemporaryPasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  if (!session.user.mustChangePassword) redirect(session.user.role === "SUPER_ADMIN" ? "/superadmin" : "/dashboard");
  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-12"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_30%),radial-gradient(circle_at_80%_75%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_28%)]" /><Card className="relative w-full max-w-lg"><CardHeader><div className="mb-2 flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary"><KeyRound /></div><CardTitle>Protect your new account</CardTitle><CardDescription>Your administrator sent a one-time password. Replace it before entering the dashboard.</CardDescription></CardHeader><CardContent><TemporaryPasswordForm /></CardContent></Card></main>;
}
