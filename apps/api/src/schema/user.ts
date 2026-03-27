export const userTypeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    role: String!
    verifiedGovEmail: Boolean!
    civicScore: Int!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    me: User
  }
`;
