"use client";

import { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const CAST_VOTE = gql`
  mutation CastPollVote($pollId: ID!, $choice: String!) {
    castPollVote(pollId: $pollId, choice: $choice) {
      id
      choice
    }
  }
`;

interface PollWidgetProps {
  pollId: string;
  question: string;
  choices: string[];
}

export function PollWidget({ pollId, question, choices }: PollWidgetProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [castVote, { loading, data }] = useMutation(CAST_VOTE);

  const handleVote = async () => {
    if (!selected) return;
    await castVote({ variables: { pollId, choice: selected } });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold">{question}</h3>
      <div className="mt-3 space-y-2">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => setSelected(choice)}
            className={`block w-full text-left px-3 py-2 rounded border ${
              selected === choice
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
      {!data && (
        <button
          onClick={handleVote}
          disabled={!selected || loading}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          {loading ? "Voting..." : "Vote"}
        </button>
      )}
      {data && (
        <p className="mt-3 text-sm text-green-600">
          Vote recorded: {data.castPollVote.choice}
        </p>
      )}
    </div>
  );
}
