import { eq } from "drizzle-orm";
import { polls, pollVotes } from "@civiclens/db";
import { db } from "../db/client.js";
import type { AuthContext } from "../auth/middleware.js";

export const pollResolvers = {
  Mutation: {
    castPollVote: async (
      _: any,
      { pollId, choice }: { pollId: string; choice: string },
      context: { auth: AuthContext }
    ) => {
      if (!context.auth.userId) throw new Error("Authentication required");

      const rows = await db
        .insert(pollVotes)
        .values({
          pollId,
          userId: context.auth.userId,
          choice,
        })
        .returning();

      return rows[0];
    },

    confirmRealVote: async (
      _: any,
      { pollVoteId }: { pollVoteId: string },
      context: { auth: AuthContext }
    ) => {
      if (!context.auth.userId) throw new Error("Authentication required");

      const rows = await db
        .update(pollVotes)
        .set({ realVoteConfirmed: true })
        .where(eq(pollVotes.id, pollVoteId))
        .returning();

      if (!rows[0]) throw new Error("Poll vote not found");
      return rows[0];
    },
  },

  Poll: {
    votes: async (parent: any) => {
      return db
        .select()
        .from(pollVotes)
        .where(eq(pollVotes.pollId, parent.id));
    },
  },
};
