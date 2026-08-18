"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Workspace = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
};

export function WorkspaceCards({
  organizations,
  activeOrganizationId,
}: {
  organizations: Workspace[];
  activeOrganizationId: string | null;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function openWorkspace(organization: Workspace) {
    if (pendingId) return;
    setPendingId(organization.id);

    try {
      if (organization.id !== activeOrganizationId) {
        const result = await authClient.organization.setActive({
          organizationId: organization.id,
        });
        if (result.error) {
          toast.error(result.error.message ?? "Could not open workspace.");
          return;
        }
      }

      toast.success(`${organization.name} is ready.`);
      router.push(`/dashboard?workspace=${organization.id}`);
      router.refresh();
    } catch {
      toast.error("Could not open workspace. Please try again.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {organizations.map((organization) => {
        const isActive = organization.id === activeOrganizationId;
        const isPending = organization.id === pendingId;

        return (
          <Card key={organization.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Building2 />
                </span>
                {isActive && (
                  <Badge variant="secondary">
                    <Check data-icon="inline-start" />
                    Active
                  </Badge>
                )}
              </div>
              <CardTitle>{organization.name}</CardTitle>
              <CardDescription>{organization.slug}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Open this workspace to view its senders, API activity, and
                delivery health.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={pendingId !== null}
                onClick={() => void openWorkspace(organization)}
              >
                {isPending ? (
                  <LoaderCircle data-icon="inline-start" className="animate-spin" />
                ) : (
                  <ArrowRight data-icon="inline-start" />
                )}
                {isPending ? "Opening…" : "Open workspace"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export function ActivateWorkspace({ organization }: { organization: Workspace }) {
  const router = useRouter();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    void authClient.organization
      .setActive({ organizationId: organization.id })
      .then((result) => {
        if (result.error) {
          toast.error(
            result.error.message ?? "Could not activate your workspace.",
          );
          return;
        }
        router.refresh();
      })
      .catch(() => toast.error("Could not activate your workspace."));
  }, [organization.id, router]);

  return null;
}
