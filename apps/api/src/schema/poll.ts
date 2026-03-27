export const pollTypeDefs = `#graphql
  type Poll {
    id: ID!
    question: String!
    billId: ID
    electionId: ID
    votes: [PollVote!]!
    createdAt: String!
  }

  type PollVote {
    id: ID!
    pollId: ID!
    userId: ID!
    choice: String!
    realVoteConfirmed: Boolean!
    createdAt: String!
  }

  extend type Mutation {
    castPollVote(pollId: ID!, choice: String!): PollVote!
    confirmRealVote(pollVoteId: ID!): PollVote!
  }
`;
