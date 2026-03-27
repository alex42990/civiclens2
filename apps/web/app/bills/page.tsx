"use client";

import { useQuery, gql } from "@apollo/client";
import { BillCard } from "@/components/BillCard";

const GET_BILLS = gql`
  query GetBills($state: String, $status: String) {
    bills(state: $state, status: $status) {
      id
      billNumber
      title
      status
      chamber
      aiSummary
    }
  }
`;

export default function BillsPage() {
  const { data, loading, error } = useQuery(GET_BILLS);

  if (loading) return <p className="text-gray-500">Loading bills...</p>;
  if (error) return <p className="text-red-500">Error loading bills.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bills</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.bills.map((b: any) => (
          <BillCard key={b.id} {...b} />
        ))}
      </div>
      {data?.bills.length === 0 && (
        <p className="text-gray-500">No bills found.</p>
      )}
    </div>
  );
}
