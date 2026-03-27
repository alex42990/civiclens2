"""Ingest donor and donation data from OpenFEC API."""

import argparse
import os
import sys

import httpx
import psycopg2
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://api.open.fec.gov/v1"


def fetch_contributions(api_key: str, state: str | None = None, limit: int = 20):
    params = {"api_key": api_key, "per_page": limit, "sort": "-contribution_receipt_date"}
    if state:
        params["contributor_state"] = state

    resp = httpx.get(f"{BASE_URL}/schedules/schedule_a/", params=params)
    resp.raise_for_status()
    return resp.json().get("results", [])


def upsert_contributions(conn, contributions):
    with conn.cursor() as cur:
        for c in contributions:
            # Upsert donor
            cur.execute(
                """
                INSERT INTO donors (id, name, employer, occupation, state)
                VALUES (gen_random_uuid(), %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
                RETURNING id
                """,
                (
                    c.get("contributor_name", "Unknown"),
                    c.get("contributor_employer"),
                    c.get("contributor_occupation"),
                    c.get("contributor_state"),
                ),
            )
            row = cur.fetchone()
            if not row:
                continue
            donor_id = row[0]

            # Insert donation (candidate linking would require candidate lookup)
            amount_cents = int(float(c.get("contribution_receipt_amount", 0)) * 100)
            cur.execute(
                """
                INSERT INTO donations (id, donor_id, candidate_id, amount_cents, donation_date, fec_transaction_id, cycle)
                VALUES (gen_random_uuid(), %s, NULL, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
                """,
                (
                    donor_id,
                    amount_cents,
                    c.get("contribution_receipt_date", "2024-01-01"),
                    c.get("transaction_id"),
                    str(c.get("two_year_transaction_period", "2024")),
                ),
            )
    conn.commit()


def main():
    parser = argparse.ArgumentParser(description="Ingest donations from OpenFEC")
    parser.add_argument("--state", help="Filter by contributor state")
    parser.add_argument("--limit", type=int, default=20, help="Number of records to fetch")
    parser.add_argument("--dry-run", action="store_true", help="Print without inserting")
    args = parser.parse_args()

    api_key = os.environ.get("FEC_API_KEY")
    if not api_key:
        print("Error: FEC_API_KEY is required", file=sys.stderr)
        sys.exit(1)

    contributions = fetch_contributions(api_key, args.state, args.limit)
    print(f"Fetched {len(contributions)} contributions from OpenFEC")

    if args.dry_run:
        for c in contributions:
            print(f"  {c.get('contributor_name')}: ${c.get('contribution_receipt_amount')}")
        return

    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL is required", file=sys.stderr)
        sys.exit(1)

    conn = psycopg2.connect(db_url)
    try:
        upsert_contributions(conn, contributions)
        print(f"Upserted {len(contributions)} contributions")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
