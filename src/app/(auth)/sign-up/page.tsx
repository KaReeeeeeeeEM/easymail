import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() { return <Card><CardHeader><CardTitle>Create your account</CardTitle><CardDescription>You can create a personal workspace or invite an organization afterward.</CardDescription></CardHeader><CardContent><AuthForm mode="sign-up" /></CardContent></Card>; }
