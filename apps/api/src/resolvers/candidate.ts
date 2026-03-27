import { eq, and, ilike } from "drizzle-orm";
import {
  candidates,
  votes,
  donations,
  donors,
  electionCandidates,
  elections,
} from "@civiclens/db";
import { db } from "../db/client.js";
import { searchClient } from "../search/client.js";
import type { AuthContext } from "../auth/middleware.js";

export const candidateResolvers = {
  Query: {
    candidate: async (_: any, { id }: { id: string }) => {
      const rows = await db.select().from(candidates).where(eq(candidates.id, id));
      return rows[0] ?? null;
    },

    candidates: async (
      _: any,
      { state, office, limit = 50 }: { state?: string; office?: string; limit?: number }
    ) => {
      const conditions = [];
      if (state) conditions.push(eq(candidates.state, state));
      if (office) conditions.push(eq(candidates.office, office));

      const query = db.select().from(candidates);
      const filtered = conditions.length > 0
        ? query.where(and(...conditions))
        : query;
      return filtered.limit(limit);
    },

    searchCandidates: async (_: any, { query }: { query: string }) => {
      try {
        const result = await searchClient.search({
          index: "candidates",
          query: {
            multi_match: {
              query,
              fields: ["name", "party", "state", "office"],
            },
          },
        });
        const ids = result.hits.hits.map((hit: any) => hit._id);
        if (ids.length === 0) return [];

        const rows = [];
        for (const id of ids) {
          const r = await db.select().from(candidates).where(eq(candidates.id, id));
          if (r[0]) rows.push(r[0]);
        }
        return rows;
      } catch {
        // Fallback to DB search if ES is unavailable
        return db
          .select()
          .from(candidates)
          .where(ilike(candidates.name, `%${query}%`))
          .limit(20);
      }
    },
  },

  Mutation: {
    claimCandidateProfile: async (
      _: any,
      { candidateId }: { candidateId: string },
      context: { auth: AuthContext }
    ) => {
      if (!context.auth.userId) throw new Error("Authentication required");

      const rows = await db
        .update(candidates)
        .set({ claimed: true, officialUserId: context.auth.userId })
        .where(eq(candidates.id, candidateId))
        .returning();

      if (!rows[0]) throw new Error("Candidate not found");
      return rows[0];
    },
  },

  Candidate: {
    votes: async (parent: any) => {
      return db.select().from(votes).where(eq(votes.candidateId, parent.id));
    },

    donations: async (parent: any) => {
      const rows = await db
        .select({
          id: donations.id,
          donorName: donors.name,
          amountCents: donations.amountCents,
          donationDate: donations.donationDate,
          cycle: donations.cycle,
        })
        .from(donations)
        .innerJoin(donors, eq(donations.donorId, donors.id))
        .where(eq(donations.candidateId, parent.id));
      return rows;
    },

    elections: async (parent: any) => {
      const rows = await db
        .select({ election: elections })
        .from(electionCandidates)
        .innerJoin(elections, eq(electionCandidates.electionId, elections.id))
        .where(eq(electionCandidates.candidateId, parent.id));
      return rows.map((r) => r.election);
    },
  },
};
