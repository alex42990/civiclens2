import { eq, and, ilike } from "drizzle-orm";
import { bills } from "@civiclens/db";
import { db } from "../db/client.js";
import { summarizeBill } from "../services/summarizer.js";
import type { AuthContext } from "../auth/middleware.js";

export const billResolvers = {
  Query: {
    bill: async (_: any, { id }: { id: string }) => {
      const rows = await db.select().from(bills).where(eq(bills.id, id));
      return rows[0] ?? null;
    },

    bills: async (
      _: any,
      { state, status, limit = 50 }: { state?: string; status?: string; limit?: number }
    ) => {
      const conditions = [];
      if (state) conditions.push(eq(bills.state, state));
      if (status) conditions.push(eq(bills.status, status));

      const query = db.select().from(bills);
      const filtered = conditions.length > 0
        ? query.where(and(...conditions))
        : query;
      return filtered.limit(limit);
    },

    searchBills: async (_: any, { query }: { query: string }) => {
      return db
        .select()
        .from(bills)
        .where(ilike(bills.title, `%${query}%`))
        .limit(20);
    },
  },

  Mutation: {
    summarizeBill: async (
      _: any,
      { billId }: { billId: string },
      context: { auth: AuthContext }
    ) => {
      if (!context.auth.userId) throw new Error("Authentication required");

      const rows = await db.select().from(bills).where(eq(bills.id, billId));
      const bill = rows[0];
      if (!bill) throw new Error("Bill not found");

      if (bill.aiSummary) return bill;

      const textToSummarize = bill.summary || bill.title;
      const aiSummary = await summarizeBill(textToSummarize);

      const updated = await db
        .update(bills)
        .set({ aiSummary })
        .where(eq(bills.id, billId))
        .returning();

      return updated[0];
    },
  },
};
