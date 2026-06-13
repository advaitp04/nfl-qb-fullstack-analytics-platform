import { useEffect, useState } from "react";
import { fetchQbs } from "../api/client";
import type { FetchQbsParams, QBRecord } from "../types/api";

interface UseQbsResult {
  qbs: QBRecord[];
  loading: boolean;
  error: string | null;
}

export function useQbs(params: FetchQbsParams = {}): UseQbsResult {
  const {
    season,
    season_type,
    team,
    limit,
    offset,
    sort_by,
    sort_order,
  } = params;

  const [qbs, setQbs] = useState<QBRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQbs() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchQbs({
          season,
          season_type,
          team,
          limit: limit ?? 500,
          offset,
          sort_by: sort_by ?? "adjusted_cortisol_rank",
          sort_order: sort_order ?? "asc",
        });

        if (!cancelled) {
          setQbs(data.results);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load QB data");
          setQbs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadQbs();

    return () => {
      cancelled = true;
    };
  }, [season, season_type, team, limit, offset, sort_by, sort_order]);

  return { qbs, loading, error };
}
