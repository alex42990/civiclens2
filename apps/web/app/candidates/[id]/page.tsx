"use client";

import { useQuery, gql } from "@apollo/client";
import { useParams } from "next/navigation";

const GET_CANDIDATE = gql`
  query GetCandidate($id: ID!) {
    candidate(id: $id) {
      id
      name
      party
      state
      district
      office
      bio
      claimed
      votes {
        id
        voteValue
        voteDate
      }
      donations {
        id
        donorName
        amountCents
        cycle
      }
    }
  }
`;

export default function CandidateDetailPage() {
  const params = useParams();
  const { data, loading, error } = useQuery(GET_CANDIDATE, {
    variables: { id: params.id },
  });

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error loading candidate.</p>;

  const c = data?.candidate;
  if (!c) return <p className="text-gray-500">Candidate not found.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{c.name}</h1>
        <p className="text-lg text-gray-600">
          {c.party} — {c.office}
        </p>
        <p className="text-gray-500">
          {c.state}
          {c.district ? `, District ${c.district}` : ""}
        </p>
        {c.bio && <p className="mt-4 text-gray-700">{c.bio}</p>}
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">Voting Record</h2>
        {c.votes.length === 0 ? (
          <p className="text-gray-500">No votes recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {c.votes.map((v: any) => (
              <div key={v.id} className="p-3 bg-white rounded shadow-sm">
                <span className="font-medium">{v.voteValue}</span>
                <span className="text-sm text-gray-500 ml-2">{v.voteDate}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Top Donations</h2>
        {c.donations.length === 0 ? (
          <p className="text-gray-500">No donation data yet.</p>
        ) : (
          <div className="space-y-2">
            {c.donations.map((d: any) => (
              <div key={d.id} className="p-3 bg-white rounded shadow-sm flex justify-between">
                <span>{d.donorName}</span>
                <span className="font-medium">
                  ${(d.amountCents / 100).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
