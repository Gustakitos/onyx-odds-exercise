"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Filters } from "@/components/filters";
import { MatchCard } from "@/components/match-card";
import { useMatches } from "@/hooks/useMatches";
import { filterMatches } from "@/lib/filters";

export default function HomePage() {
  const [sport, setSport] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const { matches, loading, error, refetch } = useMatches();

  const filteredMatches = useMemo(() => {
    return filterMatches(matches, { sport, dateRange, search });
  }, [matches, sport, dateRange, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Filters
          sport={sport}
          dateRange={dateRange}
          search={search}
          onSportChange={setSport}
          onDateRangeChange={setDateRange}
          onSearchChange={setSearch}
        />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading matches...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-destructive mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Error loading matches</h3>
            <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-muted-foreground mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Try adjusting your filters or search terms to find more matches.
            </p>
            <button
              onClick={() => {
                setSport("all");
                setDateRange("all");
                setSearch("");
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
