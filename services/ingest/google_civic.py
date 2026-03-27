"""Ingest election data from Google Civic Information API."""

import argparse
import os
import sys

import httpx
import psycopg2
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://www.googleapis.com/civicinfo/v2"


def fetch_elections(api_key: str):
    resp = httpx.get(f"{BASE_URL}/elections", params={"key": api_key})
    resp.raise_for_status()
    return resp.json().get("elections", [])


def upsert_elections(conn, elections):
    with conn.cursor() as cur:
        for election in elections:
            cur.execute(
                """
                INSERT INTO elections (id, name, state, election_date, election_type)
                VALUES (gen_random_uuid(), %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
                """,
                (
                    election.get("name", ""),
                    election.get("ocdDivisionId", "US")[:2].upper(),
                    election.get("electionDay", "2024-11-05"),
                    "general",
                ),
            )
    conn.commit()


def main():
    parser = argparse.ArgumentParser(description="Ingest elections from Google Civic Info")
    parser.add_argument("--state", help="Filter by state (post-fetch)")
    parser.add_argument("--limit", type=int, default=20, help="Max elections to process")
    parser.add_argument("--dry-run", action="store_true", help="Print without inserting")
    args = parser.parse_args()

    api_key = os.environ.get("GOOGLE_CIVIC_API_KEY")
    if not api_key:
        print("Error: GOOGLE_CIVIC_API_KEY is required", file=sys.stderr)
        sys.exit(1)

    elections = fetch_elections(api_key)
    if args.state:
        elections = [e for e in elections if args.state.upper() in e.get("ocdDivisionId", "")]
    elections = elections[: args.limit]
    print(f"Fetched {len(elections)} elections from Google Civic Info")

    if args.dry_run:
        for e in elections:
            print(f"  {e.get('name', '')}: {e.get('electionDay', '')}")
        return

    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL is required", file=sys.stderr)
        sys.exit(1)

    conn = psycopg2.connect(db_url)
    try:
        upsert_elections(conn, elections)
        print(f"Upserted {len(elections)} elections")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
