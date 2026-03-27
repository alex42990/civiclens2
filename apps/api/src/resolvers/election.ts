import { eq, and, gte } from "drizzle-orm";
import { elections, electionCandidates, candidates } from "@civiclens/db";
import { db } from "../db/client.js";
import type { AuthContext } from "../auth/middleware.js";

export const electionResolvers = {
  Query: {
    election: async (_: any, { id }: { id: string }) => {
      const rows = await db.select().from(elections).where(eq(elections.id, id));
      return rows[0] ?? null;
    },

    elections: async (
      _: any,
      { state, upcoming }: { state?: string; upcoming?: boolean }
    ) => {
      const conditions = [];
      if (state) conditions.push(eq(elections.state, state));
      if (upcoming) {
        conditions.push(gte(elections.electionDate, new Date().toISOString().split("T")[0]));
      }

      const query = db.select().from(elections);
      const filtered = conditions.length > 0
        ? query.where(and(...conditions))
        : query;
      return filtered.limit(50);
    },

    myBallot: async (
      _: any,
      __: any,
      context: { auth: AuthContext }
    ) => {
      if (!context.auth.userId) throw new Error("Authentication required");
      // Stub: return upcoming elections (would filter by user's state in production)
      return db
        .select()
        .from(elections)
        .where(gte(elections.electionDate, new Date().toISOString().split("T")[0]))
        .limit(10);
    },
  },

  Election: {
    candidates: async (parent: any) => {
      const rows = await db
        .select({ candidate: candidates })
        .from(electionCandidates)
        .innerJoin(candidates, eq(electionCandidates.candidateId, candidates.id))
        .where(eq(electionCandidates.electionId, parent.id));
      return rows.map((r) => r.candidate);
    },
  },
};
