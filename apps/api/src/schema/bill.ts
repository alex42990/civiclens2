export const billTypeDefs = `#graphql
  type Bill {
    id: ID!
    billNumber: String!
    title: String!
    summary: String
    aiSummary: String
    status: String!
    introducedDate: String!
    chamber: String!
    state: String
    congressBillId: String
    legiscanId: String
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    bill(id: ID!): Bill
    bills(state: String, status: String, limit: Int): [Bill!]!
    searchBills(query: String!): [Bill!]!
  }

  extend type Mutation {
    summarizeBill(billId: ID!): Bill!
  }
`;
