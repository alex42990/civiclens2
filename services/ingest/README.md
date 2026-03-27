# Data Ingestion Scripts

Python scripts for ingesting civic data from public APIs into the CivicLens database.

## Setup

```bash
cd services/ingest
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Fill in API keys
```

## Scripts

| Script | Source | Target Table |
|--------|--------|-------------|
| `congress_gov.py` | Congress.gov API | bills |
| `fec_api.py` | OpenFEC API | donors, donations |
| `legiscan_api.py` | LegiScan API | bills (state) |
| `google_civic.py` | Google Civic Info API | elections |
| `ballotpedia.py` | Ballotpedia API | candidates |

## Usage

All scripts accept these common arguments:

- `--state` — Filter by state abbreviation (e.g., CA, NY)
- `--limit` — Max records to fetch (default: 20)
- `--dry-run` — Print results without writing to database

```bash
# Dry run — see what would be inserted
python congress_gov.py --limit 5 --dry-run

# Ingest state bills from LegiScan
python legiscan_api.py --state CA --limit 50

# Ingest FEC donations for a state
python fec_api.py --state NY --limit 100
```

## Required Environment Variables

See `.env.example` for all required API keys. Each script will error if its required key is missing.
