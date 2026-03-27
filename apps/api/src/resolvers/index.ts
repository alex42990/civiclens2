import { candidateResolvers } from "./candidate.js";
import { billResolvers } from "./bill.js";
import { electionResolvers } from "./election.js";
import { userResolvers } from "./user.js";
import { pollResolvers } from "./poll.js";

export const resolvers = [
  candidateResolvers,
  billResolvers,
  electionResolvers,
  userResolvers,
  pollResolvers,
];
