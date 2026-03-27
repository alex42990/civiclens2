import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
import { authMiddleware } from "./auth/middleware.js";

const app = express();
const port = parseInt(process.env.PORT || "4000", 10);

const server = new ApolloServer({ typeDefs, resolvers });

await server.start();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => ({
      auth: (req as any).auth,
    }),
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}/graphql`);
});
