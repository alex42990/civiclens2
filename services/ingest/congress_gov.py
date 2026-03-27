"""Ingest bills from Congress.gov API into the bills table."""

import argparse
import os
import sys

import httpx
import psycopg2
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://api.congress.gov/v3"


def fetch_bills(api_key: str, limit: int = 20):
    resp = httpx.get(
        f"{BASE_URL}/bill",
        params={"api_key": api_key, "limit": limit, "format": "json"},
    )
    resp.raise_for_status()
    return resp.json().get("bills", [])


def upsert_bills(conn, bills):
    with conn.cursor() as cur:
        for bill in bills:
            bill_number = f"{bill.get('type', '')} {bill.get('number', '')}"
            title = bill.get("title", "")
            congress = bill.get("congress", "")
            cur.execute(
                """
                INSERT INTO bills (id, bill_number, title, status, introduced_date, chamber, congress_bill_id)
                VALUES (gen_random_uuid(), %s, %s, 'introduced', CURRENT_DATE, %s, %s)
                ON CONFLICT (bill_number) DO UPDATE SET title = EXCLUDED.title
                """,
                (
                    bill_number,
                    title,
                    bill.get("originChamber", "house").lower(),
                    f"{congress}-{bill_number}",
                ),
            )
    conn.commit()


def main():
    parser = argparse.ArgumentParser(description="Ingest bills from Congress.gov")
    parser.add_argument("--state", help="Filter by state (not used for federal bills)")
    parser.add_argument("--limit", type=int, default=20, help="Number of bills to fetch")
    parser.add_argument("--dry-run", action="store_true", help="Print without inserting")
    args = parser.parse_args()

    api_key = os.environ.get("CONGRESS_GOV_API_KEY")
    if not api_key:
        print("Error: CONGRESS_GOV_API_KEY is required", file=sys.stderr)
        sys.exit(1)

    bills = fetch_bills(api_key, args.limit)
    print(f"Fetched {len(bills)} bills from Congress.gov")

    if args.dry_run:
        for bill in bills:
            print(f"  {bill.get('type', '')} {bill.get('number', '')}: {bill.get('title', '')}")
        return

    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL is required", file=sys.stderr)
        sys.exit(1)

    conn = psycopg2.connect(db_url)
    try:
        upsert_bills(conn, bills)
        print(f"Upserted {len(bills)} bills")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
