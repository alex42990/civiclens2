# CivicLens

Civic accountability platform. Track bills, votes, donations, and elections — all in one place. Hold your representatives accountable with transparent data and AI-powered bill summaries.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| API | Node.js, Express, Apollo Server 4 (GraphQL) |
| Database | PostgreSQL 16, Drizzle ORM |
| Auth | Clerk |
| Search | Elasticsearch 8 |
| AI | Google Gemini (bill summarization) |
| Ingestion | Python 3.11 + httpx |
| Monorepo | pnpm workspaces |

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- Python 3.11+ (for ingestion scripts)

## Quick Start

```bash
# Start local services (Postgres, Redis, Elasticsearch)
docker-compose up -d

# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Push database schema
pnpm db:push

# Start development servers
pnpm dev
```

The API runs at http://localhost:4000/graphql and the web app at http://localhost:3000.

## Folder Structure

```
civiclens2/
├── apps/
│   ├── web/              # Next.js 14 frontend
│   └── api/              # GraphQL API server
├── packages/
│   └── db/               # Drizzle ORM schema + migrations
├── services/
│   └── ingest/           # Python data ingestion scripts
├── .github/workflows/    # CI/CD pipeline
├── docker-compose.yml    # Local dev services
└── pnpm-workspace.yaml   # Monorepo config
```

## Environment Variables

See `.env.example` files in each app for required variables:
- `apps/api/.env.example` — Database, Redis, Elasticsearch, Clerk, Gemini
- `apps/web/.env.example` — API URL, Clerk keys
- `services/ingest/.env.example` — Database, API keys for data sources

## Ingestion Scripts

```bash
cd services/ingest
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Example: fetch bills in dry-run mode
python congress_gov.py --limit 5 --dry-run
```

See `services/ingest/README.md` for details on each script.
