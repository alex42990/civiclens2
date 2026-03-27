"use client";

import Link from "next/link";

const NAV_LINKS = [
  { href: "/candidates", label: "Candidates" },
  { href: "/bills", label: "Bills" },
  { href: "/elections", label: "Elections" },
  { href: "/ballot", label: "My Ballot" },
  { href: "/search", label: "Search" },
];

function AuthButtons() {
  try {
    const {
      SignInButton,
      SignedIn,
      SignedOut,
      UserButton,
    } = require("@clerk/nextjs");

    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      return null;
    }

    return (
      <>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </>
    );
  } catch {
    return null;
  }
}

export function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-blue-600">
          CivicLens
        </Link>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-700 hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
