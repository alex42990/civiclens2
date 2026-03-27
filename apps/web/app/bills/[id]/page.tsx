"use client";

import { useQuery, gql } from "@apollo/client";
import { useParams } from "next/navigation";

const GET_BILL = gql`
  query GetBill($id: ID!) {
    bill(id: $id) {
      id
      billNumber
      title
      summary
      aiSummary
      status
      introducedDate
      chamber
      state
    }
  }
`;

export default function BillDetailPage() {
  const params = useParams();
  const { data, loading, error } = useQuery(GET_BILL, {
    variables: { id: params.id },
  });

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error loading bill.</p>;

  const b = data?.bill;
  if (!b) return <p className="text-gray-500">Bill not found.</p>;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {b.chamber}
          </span>
          <span className="text-sm text-gray-500">{b.billNumber}</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold">{b.title}</h1>
        <p className="text-gray-500">
          Status: {b.status} · Introduced: {b.introducedDate}
          {b.state && ` · ${b.state}`}
        </p>
      </div>

      {b.aiSummary && (
        <section>
          <h2 className="text-xl font-semibold mb-2">AI Summary</h2>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
            {b.aiSummary}
          </p>
        </section>
      )}

      {b.summary && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Official Summary</h2>
          <p className="text-gray-700">{b.summary}</p>
        </section>
      )}
    </div>
  );
}
