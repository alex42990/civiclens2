export const candidateTypeDefs = `#graphql
  type Candidate {
    id: ID!
    name: String!
    party: String!
    state: String!
    district: String
    office: String!
    bio: String
    claimed: Boolean!
    ballotpediaId: String
    votes: [Vote!]!
    donations: [Donation!]!
    elections: [Election!]!
    createdAt: String!
    updatedAt: String!
  }

  type Vote {
    id: ID!
    billId: ID!
    voteValue: String!
    voteDate: String!
    source: String!
  }

  type Donation {
    id: ID!
    donorName: String!
    amountCents: Int!
    donationDate: String!
    cycle: String!
  }

  extend type Query {
    candidate(id: ID!): Candidate
    candidates(state: String, office: String, limit: Int): [Candidate!]!
    searchCandidates(query: String!): [Candidate!]!
  }

  extend type Mutation {
    claimCandidateProfile(candidateId: ID!): Candidate!
  }
`;
