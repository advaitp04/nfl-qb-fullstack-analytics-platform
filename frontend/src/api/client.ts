import type {
  AdvancedMetricsListResponse,
  FetchQbsParams,
  HealthResponse,
  QBListResponse,
} from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function buildSearchParams(
  params: Record<string, string | number | undefined>
): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchQbs(
  params: FetchQbsParams = {}
): Promise<QBListResponse> {
  const searchParams = buildSearchParams(
    params as Record<string, string | number | undefined>
  );
  return getJson<QBListResponse>(`${API_BASE_URL}/api/qbs?${searchParams}`);
}

export async function fetchQbByName(
  name: string,
  season?: number
): Promise<QBListResponse> {
  const searchParams = buildSearchParams({ season });
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : "";
  return getJson<QBListResponse>(
    `${API_BASE_URL}/api/qbs/${encodeURIComponent(name)}${suffix}`
  );
}

export async function fetchCortisolRankings(params: {
  season?: number;
  season_type?: FetchQbsParams["season_type"];
  limit?: number;
  offset?: number;
} = {}): Promise<QBListResponse> {
  const searchParams = buildSearchParams(params);
  return getJson<QBListResponse>(
    `${API_BASE_URL}/api/rankings/cortisol?${searchParams}`
  );
}

export async function fetchAdvancedMetrics(params: {
  season?: number;
  season_type?: FetchQbsParams["season_type"];
  limit?: number;
  offset?: number;
} = {}): Promise<AdvancedMetricsListResponse> {
  const searchParams = buildSearchParams(params);
  return getJson<AdvancedMetricsListResponse>(
    `${API_BASE_URL}/api/advanced-metrics?${searchParams}`
  );
}

export async function fetchHealth(): Promise<HealthResponse> {
  return getJson<HealthResponse>(`${API_BASE_URL}/api/health`);
}
