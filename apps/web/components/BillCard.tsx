import Link from "next/link";

interface BillCardProps {
  id: string;
  billNumber: string;
  title: string;
  status: string;
  chamber: string;
  aiSummary?: string | null;
}

export function BillCard({
  id,
  billNumber,
  title,
  status,
  chamber,
  aiSummary,
}: BillCardProps) {
  return (
    <Link
      href={`/bills/${id}`}
      className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
          {chamber}
        </span>
        <span className="text-xs text-gray-500">{billNumber}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">Status: {status}</p>
      {aiSummary && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{aiSummary}</p>
      )}
    </Link>
  );
}
