import Link from "next/link";

interface CandidateCardProps {
  id: string;
  name: string;
  party: string;
  state: string;
  office: string;
  district?: string | null;
}

export function CandidateCard({
  id,
  name,
  party,
  state,
  office,
  district,
}: CandidateCardProps) {
  return (
    <Link
      href={`/candidates/${id}`}
      className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">
        {party} — {office}
      </p>
      <p className="text-sm text-gray-500">
        {state}
        {district ? `, District ${district}` : ""}
      </p>
    </Link>
  );
}
