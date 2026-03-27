import { searchClient } from "./client.js";

const CANDIDATE_INDEX = {
  index: "candidates",
  body: {
    mappings: {
      properties: {
        name: { type: "text" },
        party: { type: "keyword" },
        state: { type: "keyword" },
        district: { type: "keyword" },
        office: { type: "text" },
        bio: { type: "text" },
      },
    },
  },
};

const BILL_INDEX = {
  index: "bills",
  body: {
    mappings: {
      properties: {
        billNumber: { type: "keyword" },
        title: { type: "text" },
        summary: { type: "text" },
        status: { type: "keyword" },
        chamber: { type: "keyword" },
        state: { type: "keyword" },
      },
    },
  },
};

export async function ensureIndices() {
  for (const def of [CANDIDATE_INDEX, BILL_INDEX]) {
    const exists = await searchClient.indices.exists({ index: def.index });
    if (!exists) {
      await searchClient.indices.create(def);
    }
  }
}
