"use client";

import { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { CandidateCard } from "@/components/CandidateCard";
import { BillCard } from "@/components/BillCard";

const SEARCH_CANDIDATES = gql`
  query SearchCandidates($query: String!) {
    searchCandidates(query: $query) {
      id
      name
      party
      state
      office
      district
    }
  }
`;

const SEARCH_BILLS = gql`
  query SearchBills($query: String!) {
    searchBills(query: $query) {
      id
      billNumber
      title
      status
      chamber
      aiSummary
    }
  }
`;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchCandidates, candidateResults] = useLazyQuery(SEARCH_CANDIDATES);
  const [searchBills, billResults] = useLazyQuery(SEARCH_BILLS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchCandidates({ variables: { query } });
    searchBills({ variables: { query } });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Search</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search candidates or bills..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {candidateResults.data?.searchCandidates.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Candidates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidateResults.data.searchCandidates.map((c: any) => (
              <CandidateCard key={c.id} {...c} />
            ))}
          </div>
        </section>
      )}

      {billResults.data?.searchBills.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Bills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {billResults.data.searchBills.map((b: any) => (
              <BillCard key={b.id} {...b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
