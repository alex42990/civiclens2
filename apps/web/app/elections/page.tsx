"use client";

import { useQuery, gql } from "@apollo/client";

const GET_ELECTIONS = gql`
  query GetElections($state: String, $upcoming: Boolean) {
    elections(state: $state, upcoming: $upcoming) {
      id
      name
      state
      electionDate
      electionType
    }
  }
`;

export default function ElectionsPage() {
  const { data, loading, error } = useQuery(GET_ELECTIONS, {
    variables: { upcoming: true },
  });

  if (loading) return <p className="text-gray-500">Loading elections...</p>;
  if (error) return <p className="text-red-500">Error loading elections.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Upcoming Elections</h1>
      <div className="space-y-4">
        {data?.elections.map((e: any) => (
          <div key={e.id} className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold">{e.name}</h3>
            <p className="text-sm text-gray-600">
              {e.state} · {e.electionType} · {e.electionDate}
            </p>
          </div>
        ))}
      </div>
      {data?.elections.length === 0 && (
        <p className="text-gray-500">No upcoming elections found.</p>
      )}
    </div>
  );
}
