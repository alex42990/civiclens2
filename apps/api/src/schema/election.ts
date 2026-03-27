export const electionTypeDefs = `#graphql
  type Election {
    id: ID!
    name: String!
    state: String!
    electionDate: String!
    electionType: String!
    candidates: [Candidate!]!
    createdAt: String!
  }

  extend type Query {
    election(id: ID!): Election
    elections(state: String, upcoming: Boolean): [Election!]!
    myBallot: [Election!]!
  }
`;
