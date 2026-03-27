import { Client } from "@elastic/elasticsearch";

export const searchClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
});
