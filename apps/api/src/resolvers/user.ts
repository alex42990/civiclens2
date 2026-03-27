import { eq } from "drizzle-orm";
import { users } from "@civiclens/db";
import { db } from "../db/client.js";
import type { AuthContext } from "../auth/middleware.js";

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: { auth: AuthContext }) => {
      if (!context.auth.userId) return null;
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.id, context.auth.userId));
      return rows[0] ?? null;
    },
  },
};
