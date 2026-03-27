"use client";

import { ApolloProvider } from "@apollo/client";
import { ClerkProvider } from "@clerk/nextjs";
import { createApolloClient } from "@/lib/graphql";

const client = createApolloClient();

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function Providers({ children }: { children: React.ReactNode }) {
  const inner = <ApolloProvider client={client}>{children}</ApolloProvider>;

  if (!clerkKey) {
    return inner;
  }

  return <ClerkProvider publishableKey={clerkKey}>{inner}</ClerkProvider>;
}
