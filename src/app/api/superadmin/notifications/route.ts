import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { adminNotification } from "@/db/schema";
import { auth } from "@/lib/auth";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("mark-read"), id: z.string().uuid() }),
  z.object({ action: z.literal("mark-all-read") }),
  z.object({ action: z.literal("clear-all") }),
]);

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "SUPER_ADMIN")
    return NextResponse.json(
      { error: { message: "Forbidden" } },
      { status: 403 },
    );
  try {
    const input = actionSchema.parse(await request.json());
    if (input.action === "mark-read")
      await db
        .update(adminNotification)
        .set({ readAt: new Date() })
        .where(
          and(
            eq(adminNotification.id, input.id),
            eq(adminNotification.userId, session.user.id),
          ),
        );
    if (input.action === "mark-all-read")
      await db
        .update(adminNotification)
        .set({ readAt: new Date() })
        .where(eq(adminNotification.userId, session.user.id));
    if (input.action === "clear-all")
      await db
        .delete(adminNotification)
        .where(eq(adminNotification.userId, session.user.id));
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Notification action failed.",
        },
      },
      { status: 400 },
    );
  }
}
