interface CivicScoreProps {
  score: number;
}

export function CivicScore({ score }: CivicScoreProps) {
  const color =
    score >= 75
      ? "text-green-600"
      : score >= 50
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Civic Score</span>
      <span className={`text-lg font-bold ${color}`}>{score}</span>
    </div>
  );
}
