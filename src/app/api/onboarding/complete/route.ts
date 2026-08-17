import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { onboardingPageVisit } from "@/db/schema";
import { auth } from "@/lib/auth";

const schema = z.object({ pageKey: z.string().regex(/^[a-z0-9-]{1,50}$/) });

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const { pageKey } = schema.parse(await request.json());
  await db.insert(onboardingPageVisit).values({ userId: session.user.id, pageKey }).onConflictDoNothing();
  return NextResponse.json({ data: { completed: true } });
}
