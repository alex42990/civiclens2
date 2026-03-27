import { candidateTypeDefs } from "./candidate.js";
import { billTypeDefs } from "./bill.js";
import { electionTypeDefs } from "./election.js";
import { userTypeDefs } from "./user.js";
import { pollTypeDefs } from "./poll.js";

const baseTypeDefs = `#graphql
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [
  baseTypeDefs,
  candidateTypeDefs,
  billTypeDefs,
  electionTypeDefs,
  userTypeDefs,
  pollTypeDefs,
];
