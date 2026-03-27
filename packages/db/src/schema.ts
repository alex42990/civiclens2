import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  date,
  timestamp,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "citizen",
  "official",
  "admin",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").notNull().default("citizen"),
  verifiedGovEmail: boolean("verified_gov_email").notNull().default(false),
  personaVerificationId: text("persona_verification_id"),
  civicScore: integer("civic_score").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const candidates = pgTable("candidates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  party: text("party").notNull(),
  state: text("state").notNull(),
  district: text("district"),
  office: text("office").notNull(),
  bio: text("bio"),
  claimed: boolean("claimed").notNull().default(false),
  officialUserId: uuid("official_user_id").references(() => users.id),
  ballotpediaId: text("ballotpedia_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const elections = pgTable("elections", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  electionDate: date("election_date").notNull(),
  electionType: text("election_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const electionCandidates = pgTable(
  "election_candidates",
  {
    electionId: uuid("election_id")
      .notNull()
      .references(() => elections.id),
    candidateId: uuid("candidate_id")
      .notNull()
      .references(() => candidates.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.electionId, t.candidateId] }),
  })
);

export const bills = pgTable("bills", {
  id: uuid("id").defaultRandom().primaryKey(),
  billNumber: text("bill_number").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  aiSummary: text("ai_summary"),
  status: text("status").notNull(),
  introducedDate: date("introduced_date").notNull(),
  chamber: text("chamber").notNull(),
  state: text("state"),
  congressBillId: text("congress_bill_id"),
  legiscanId: text("legiscan_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const votes = pgTable("votes", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id),
  billId: uuid("bill_id")
    .notNull()
    .references(() => bills.id),
  voteValue: text("vote_value").notNull(),
  voteDate: date("vote_date").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const donors = pgTable("donors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  employer: text("employer"),
  occupation: text("occupation"),
  state: text("state"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const donations = pgTable("donations", {
  id: uuid("id").defaultRandom().primaryKey(),
  donorId: uuid("donor_id")
    .notNull()
    .references(() => donors.id),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id),
  amountCents: integer("amount_cents").notNull(),
  donationDate: date("donation_date").notNull(),
  fecTransactionId: text("fec_transaction_id"),
  cycle: text("cycle").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const justifications = pgTable("justifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id),
  billId: uuid("bill_id")
    .notNull()
    .references(() => bills.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const polls = pgTable("polls", {
  id: uuid("id").defaultRandom().primaryKey(),
  billId: uuid("bill_id").references(() => bills.id),
  electionId: uuid("election_id").references(() => elections.id),
  question: text("question").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pollVotes = pgTable("poll_votes", {
  id: uuid("id").defaultRandom().primaryKey(),
  pollId: uuid("poll_id")
    .notNull()
    .references(() => polls.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  choice: text("choice").notNull(),
  realVoteConfirmed: boolean("real_vote_confirmed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
