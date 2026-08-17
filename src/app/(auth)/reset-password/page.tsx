import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResetPasswordPage() { return <Card><CardHeader><CardTitle>Choose a new password</CardTitle><CardDescription>Reset links expire after 15 minutes and can only be used once.</CardDescription></CardHeader><CardContent><Suspense fallback={<Skeleton className="h-40 w-full" />}><ResetPasswordForm /></Suspense></CardContent></Card>; }
