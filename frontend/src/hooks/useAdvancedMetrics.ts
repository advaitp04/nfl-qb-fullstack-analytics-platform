import { useEffect, useState } from "react";
import { fetchAdvancedMetrics } from "../api/client";
import type { AdvancedMetricsRecord, FetchQbsParams } from "../types/api";

interface UseAdvancedMetricsResult {
  records: AdvancedMetricsRecord[];
  loading: boolean;
  error: string | null;
}

type UseAdvancedMetricsParams = {
  season?: number;
  season_type?: FetchQbsParams["season_type"];
  limit?: number;
  offset?: number;
};

export function useAdvancedMetrics(
  params: UseAdvancedMetricsParams = {}
): UseAdvancedMetricsResult {
  const { season, season_type, limit, offset } = params;

  const [records, setRecords] = useState<AdvancedMetricsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAdvancedMetrics() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchAdvancedMetrics({
          season,
          season_type,
          limit: limit ?? 500,
          offset,
        });

        if (!cancelled) {
          setRecords(data.results);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load advanced metrics");
          setRecords([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAdvancedMetrics();

    return () => {
      cancelled = true;
    };
  }, [season, season_type, limit, offset]);

  return { records, loading, error };
}
