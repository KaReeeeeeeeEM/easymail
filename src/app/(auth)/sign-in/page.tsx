import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() { return <Card><CardHeader><CardTitle>Welcome back</CardTitle><CardDescription>Sign in to manage senders and API keys.</CardDescription></CardHeader><CardContent><AuthForm mode="sign-in" /></CardContent></Card>; }
