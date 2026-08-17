import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() { return <Card><CardHeader><CardTitle>Reset your password</CardTitle><CardDescription>We will send recovery instructions if the address belongs to an account.</CardDescription></CardHeader><CardContent><ForgotPasswordForm /></CardContent></Card>; }
