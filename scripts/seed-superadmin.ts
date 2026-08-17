import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { account, twoFactor, user } from "../src/db/auth-schema";
import { auditLog } from "../src/db/schema";

const email = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SUPERADMIN_PASSWORD;
const databaseUrl = process.env.DATABASE_URL;
if (!email || !email.endsWith("@gmail.com") || !password || password.length < 14 || !databaseUrl) throw new Error("Provide DATABASE_URL, a Gmail SUPERADMIN_EMAIL, and a 14+ character SUPERADMIN_PASSWORD.");

const client = postgres(databaseUrl, { max: 1, prepare: false });
const db = drizzle(client);
const passwordHash = await hashPassword(password);
const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
const userId = existing?.id ?? randomUUID();

await db.transaction(async (tx) => {
  if (existing) await tx.update(user).set({ name: "easymail Superadmin", role: "SUPER_ADMIN", emailVerified: true, twoFactorEnabled: false, updatedAt: new Date() }).where(eq(user.id, userId));
  else await tx.insert(user).values({ id: userId, name: "easymail Superadmin", email, role: "SUPER_ADMIN", emailVerified: true, twoFactorEnabled: false });
  const [credential] = await tx.select({ id: account.id }).from(account).where(and(eq(account.userId, userId), eq(account.providerId, "credential"))).limit(1);
  if (credential) await tx.update(account).set({ password: passwordHash, updatedAt: new Date() }).where(eq(account.id, credential.id));
  else await tx.insert(account).values({ id: randomUUID(), accountId: userId, providerId: "credential", userId, password: passwordHash });
  await tx.delete(twoFactor).where(eq(twoFactor.userId, userId));
  await tx.insert(auditLog).values({ action: "SUPERADMIN_SEEDED", entity: "user", entityId: userId, description: "Super administrator credentials were provisioned.", actorId: userId, actorEmail: email });
});
await client.end();
console.log(`Seeded SUPER_ADMIN ${email}`);
