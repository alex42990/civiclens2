"use client";

import { useQuery, gql } from "@apollo/client";

const MY_BALLOT = gql`
  query MyBallot {
    myBallot {
      id
      name
      state
      electionDate
      electionType
      candidates {
        id
        name
        party
        office
      }
    }
  }
`;

export default function BallotPage() {
  const { data, loading, error } = useQuery(MY_BALLOT);

  if (loading) return <p className="text-gray-500">Loading your ballot...</p>;
  if (error)
    return (
      <p className="text-gray-500">
        Sign in to see your personalized ballot.
      </p>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Ballot</h1>
      <div className="space-y-6">
        {data?.myBallot.map((election: any) => (
          <div key={election.id} className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold">{election.name}</h2>
            <p className="text-sm text-gray-500 mb-3">
              {election.state} · {election.electionDate}
            </p>
            <div className="space-y-2">
              {election.candidates.map((c: any) => (
                <div
                  key={c.id}
                  className="p-2 border border-gray-100 rounded flex justify-between"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-sm text-gray-500">
                    {c.party} · {c.office}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {data?.myBallot.length === 0 && (
        <p className="text-gray-500">No upcoming elections on your ballot.</p>
      )}
    </div>
  );
}
