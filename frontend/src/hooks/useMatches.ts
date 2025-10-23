import { useState, useEffect, useCallback } from 'react';
import { matchesApi, ApiError } from '@/lib/api';
import type { Match } from '@/data/matches';

interface UseMatchesState {
  matches: Match[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMatches(): UseMatchesState {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matchesApi.getMatches();
      setMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);

      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching matches');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return {
    matches,
    loading,
    error,
    refetch: fetchMatches,
  };
}

interface UseMatchesByLeagueState {
  matches: Match[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMatchesByLeague(league: string): UseMatchesByLeagueState {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matchesApi.getMatchesBySport(league);
      setMatches(data);
    } catch (err) {
      console.error(`Error fetching matches for league ${league}:`, err);

      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`An unexpected error occurred while fetching matches for ${league}`);
      }
    } finally {
      setLoading(false);
    }
  }, [league]);

  useEffect(() => {
    if (league && league !== 'all') {
      fetchMatches();
    } else {
      setMatches([]);
      setLoading(false);
      setError(null);
    }
  }, [fetchMatches, league]);

  return {
    matches,
    loading,
    error,
    refetch: fetchMatches,
  };
}