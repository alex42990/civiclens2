import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          CivicLens
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Hold your representatives accountable. Track bills, votes, donations,
          and elections — all in one place.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/candidates"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold">Candidates</h2>
          <p className="mt-2 text-gray-600">
            Browse candidates, see their voting records and funding sources.
          </p>
        </Link>

        <Link
          href="/bills"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold">Bills</h2>
          <p className="mt-2 text-gray-600">
            Track legislation with AI-powered plain-English summaries.
          </p>
        </Link>

        <Link
          href="/elections"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold">Elections</h2>
          <p className="mt-2 text-gray-600">
            Find upcoming elections and see who&apos;s on your ballot.
          </p>
        </Link>
      </div>
    </div>
  );
}
