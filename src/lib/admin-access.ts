import { createAccessControl } from "better-auth/plugins/access";

const statements = {
  user: ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "set-email", "get", "update"],
  session: ["list", "revoke", "delete"],
} as const;

export const adminAccess = createAccessControl(statements);
export const adminRoles = {
  SUPER_ADMIN: adminAccess.newRole({ user: [...statements.user], session: [...statements.session] }),
  USER: adminAccess.newRole({ user: [], session: [] }),
};
