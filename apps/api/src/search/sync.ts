import { searchClient } from "./client.js";
import { db } from "../db/client.js";
import { candidates, bills } from "@civiclens/db";
import { ensureIndices } from "./index.js";

async function syncCandidates() {
  const rows = await db.select().from(candidates);
  for (const row of rows) {
    await searchClient.index({
      index: "candidates",
      id: row.id,
      document: {
        name: row.name,
        party: row.party,
        state: row.state,
        district: row.district,
        office: row.office,
        bio: row.bio,
      },
    });
  }
  console.log(`Synced ${rows.length} candidates to Elasticsearch`);
}

async function syncBills() {
  const rows = await db.select().from(bills);
  for (const row of rows) {
    await searchClient.index({
      index: "bills",
      id: row.id,
      document: {
        billNumber: row.billNumber,
        title: row.title,
        summary: row.summary,
        status: row.status,
        chamber: row.chamber,
        state: row.state,
      },
    });
  }
  console.log(`Synced ${rows.length} bills to Elasticsearch`);
}

async function main() {
  await ensureIndices();
  await syncCandidates();
  await syncBills();
  console.log("Sync complete");
  process.exit(0);
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
