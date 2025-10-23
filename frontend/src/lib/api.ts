import type { Match } from "@/data/matches";

function getApiBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiUrl) {
    throw new Error(
      "Internal server error"
    );
  }

  return apiUrl;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        if (errorText.trim()) {
          errorMessage = errorText;
        }
      }

      throw new ApiError(errorMessage, response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout - please try again');
      }
      throw new ApiError(`Network error: ${error.message}`);
    }

    throw new ApiError('An unexpected error occurred');
  }
}

export const matchesApi = {
  async getMatches(filters?: {
    sport?: string;
    status?: 'scheduled' | 'in_progress' | 'completed';
    team?: string;
    date?: string;
    limit?: number;
    offset?: number;
  }): Promise<Match[]> {
    try {
      let endpoint = '/api/v1/matches';

      if (filters) {
        const params = new URLSearchParams();
        if (filters.sport) params.append('sport', filters.sport);
        if (filters.status) params.append('status', filters.status);
        if (filters.team) params.append('team', filters.team);
        if (filters.date) params.append('date', filters.date);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.offset) params.append('offset', filters.offset.toString());

        const queryString = params.toString();
        if (queryString) {
          endpoint += `?${queryString}`;
        }
      }

      const response = await apiRequest<ApiResponse<Match[]>>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      throw error;
    }
  },

  async getMatchesBySport(sport: string, pagination?: { limit?: number; offset?: number }): Promise<Match[]> {
    try {
      let endpoint = `/api/v1/matches/sport/${encodeURIComponent(sport)}`;

      if (pagination) {
        const params = new URLSearchParams();
        if (pagination.limit) params.append('limit', pagination.limit.toString());
        if (pagination.offset) params.append('offset', pagination.offset.toString());

        const queryString = params.toString();
        if (queryString) {
          endpoint += `?${queryString}`;
        }
      }

      const response = await apiRequest<ApiResponse<Match[]>>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch matches for sport ${sport}:`, error);
      throw error;
    }
  },

  async getMatchesByStatus(status: 'scheduled' | 'in_progress' | 'completed', pagination?: { limit?: number; offset?: number }): Promise<Match[]> {
    try {
      let endpoint = `/api/v1/matches/status/${encodeURIComponent(status)}`;

      if (pagination) {
        const params = new URLSearchParams();
        if (pagination.limit) params.append('limit', pagination.limit.toString());
        if (pagination.offset) params.append('offset', pagination.offset.toString());

        const queryString = params.toString();
        if (queryString) {
          endpoint += `?${queryString}`;
        }
      }

      const response = await apiRequest<ApiResponse<Match[]>>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch matches for status ${status}:`, error);
      throw error;
    }
  },

  async getMatch(id: string | number): Promise<Match> {
    try {
      const response = await apiRequest<ApiResponse<Match>>(`/api/v1/matches/${encodeURIComponent(id)}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch match ${id}:`, error);
      throw error;
    }
  },
};

export type { ApiError as ApiErrorType, ApiResponse };