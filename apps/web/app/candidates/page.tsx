"use client";

import { useQuery, gql } from "@apollo/client";
import { CandidateCard } from "@/components/CandidateCard";

const GET_CANDIDATES = gql`
  query GetCandidates($state: String, $office: String) {
    candidates(state: $state, office: $office) {
      id
      name
      party
      state
      office
      district
    }
  }
`;

export default function CandidatesPage() {
  const { data, loading, error } = useQuery(GET_CANDIDATES);

  if (loading) return <p className="text-gray-500">Loading candidates...</p>;
  if (error) return <p className="text-red-500">Error loading candidates.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Candidates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.candidates.map((c: any) => (
          <CandidateCard key={c.id} {...c} />
        ))}
      </div>
      {data?.candidates.length === 0 && (
        <p className="text-gray-500">No candidates found.</p>
      )}
    </div>
  );
}
