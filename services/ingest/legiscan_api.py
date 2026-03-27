"""Ingest state bills from LegiScan API."""

import argparse
import os
import sys

import httpx
import psycopg2
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://api.legiscan.com"


def fetch_bills(api_key: str, state: str = "CA", limit: int = 20):
    resp = httpx.get(
        BASE_URL,
        params={"key": api_key, "op": "getMasterList", "state": state},
    )
    resp.raise_for_status()
    data = resp.json().get("masterlist", {})

    bills = []
    for key, item in data.items():
        if key == "session":
            continue
        bills.append(item)
        if len(bills) >= limit:
            break
    return bills


def upsert_bills(conn, bills, state: str):
    with conn.cursor() as cur:
        for bill in bills:
            cur.execute(
                """
                INSERT INTO bills (id, bill_number, title, status, introduced_date, chamber, state, legiscan_id)
                VALUES (gen_random_uuid(), %s, %s, %s, CURRENT_DATE, %s, %s, %s)
                ON CONFLICT DO NOTHING
                """,
                (
                    bill.get("number", ""),
                    bill.get("title", ""),
                    bill.get("status", "introduced"),
                    "house",
                    state,
                    str(bill.get("bill_id", "")),
                ),
            )
    conn.commit()


def main():
    parser = argparse.ArgumentParser(description="Ingest state bills from LegiScan")
    parser.add_argument("--state", default="CA", help="State abbreviation")
    parser.add_argument("--limit", type=int, default=20, help="Number of bills to fetch")
    parser.add_argument("--dry-run", action="store_true", help="Print without inserting")
    args = parser.parse_args()

    api_key = os.environ.get("LEGISCAN_API_KEY")
    if not api_key:
        print("Error: LEGISCAN_API_KEY is required", file=sys.stderr)
        sys.exit(1)

    bills = fetch_bills(api_key, args.state, args.limit)
    print(f"Fetched {len(bills)} bills from LegiScan ({args.state})")

    if args.dry_run:
        for bill in bills:
            print(f"  {bill.get('number', '')}: {bill.get('title', '')}")
        return

    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL is required", file=sys.stderr)
        sys.exit(1)

    conn = psycopg2.connect(db_url)
    try:
        upsert_bills(conn, bills, args.state)
        print(f"Upserted {len(bills)} bills")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
