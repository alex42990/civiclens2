"""Ingest candidate data from Ballotpedia API."""

import argparse
import os
import sys

import httpx
import psycopg2
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://api4.ballotpedia.org/data"


def fetch_candidates(api_key: str, state: str = "CA", limit: int = 20):
    # Ballotpedia API requires enterprise access — this is a stub for the expected shape
    resp = httpx.get(
        f"{BASE_URL}/election_candidates",
        params={"filters[state]": state, "limit": limit},
        headers={"x-api-key": api_key},
    )
    resp.raise_for_status()
    return resp.json().get("data", [])


def upsert_candidates(conn, candidates):
    with conn.cursor() as cur:
        for c in candidates:
            cur.execute(
                """
                INSERT INTO candidates (id, name, party, state, office, ballotpedia_id)
                VALUES (gen_random_uuid(), %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
                """,
                (
                    c.get("name", ""),
                    c.get("party", "Unknown"),
                    c.get("state", ""),
                    c.get("office", ""),
                    str(c.get("id", "")),
                ),
            )
    conn.commit()


def main():
    parser = argparse.ArgumentParser(description="Ingest candidates from Ballotpedia")
    parser.add_argument("--state", default="CA", help="State abbreviation")
    parser.add_argument("--limit", type=int, default=20, help="Number of candidates")
    parser.add_argument("--dry-run", action="store_true", help="Print without inserting")
    args = parser.parse_args()

    api_key = os.environ.get("BALLOTPEDIA_API_KEY", "")
    if not api_key:
        print("Warning: BALLOTPEDIA_API_KEY not set — API may reject requests", file=sys.stderr)

    try:
        candidates = fetch_candidates(api_key, args.state, args.limit)
    except httpx.HTTPError as e:
        print(f"Error fetching from Ballotpedia: {e}", file=sys.stderr)
        print("Note: Ballotpedia API requires enterprise access.", file=sys.stderr)
        sys.exit(1)

    print(f"Fetched {len(candidates)} candidates from Ballotpedia ({args.state})")

    if args.dry_run:
        for c in candidates:
            print(f"  {c.get('name', '')}: {c.get('party', '')} - {c.get('office', '')}")
        return

    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL is required", file=sys.stderr)
        sys.exit(1)

    conn = psycopg2.connect(db_url)
    try:
        upsert_candidates(conn, candidates)
        print(f"Upserted {len(candidates)} candidates")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
