import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() { return <div className="flex flex-col gap-6"><div><p className="text-sm font-medium text-primary">Workspace</p><h1 className="text-3xl font-semibold tracking-tight">Settings</h1></div><Card><CardHeader><CardTitle>Organization management</CardTitle><CardDescription>Member invitations, teams, and roles are available through the Better Auth organization endpoints under `/api/auth/organization/*`.</CardDescription></CardHeader></Card></div>; }
