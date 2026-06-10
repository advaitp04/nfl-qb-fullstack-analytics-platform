import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_SEASON,
  DEFAULT_SEASON_TYPE,
  getDropbackFilterConfig,
} from "../constants/filters";
import type { QBRecord, SeasonType } from "../types/api";

interface UseLeaderboardFiltersResult {
  season: number;
  setSeason: (season: number) => void;
  seasonType: SeasonType;
  setSeasonType: (seasonType: SeasonType) => void;
  minDropbacks: number;
  setMinDropbacks: (value: number) => void;
  maxDropbacks: number;
  dropbackStep: number;
  dropbackMin: number;
  filteredQbs: QBRecord[];
}

export function useLeaderboardFilters(
  qbs: QBRecord[]
): UseLeaderboardFiltersResult {
  const [season, setSeason] = useState(DEFAULT_SEASON);
  const [seasonType, setSeasonType] = useState<SeasonType>(DEFAULT_SEASON_TYPE);
  const [minDropbacks, setMinDropbacks] = useState(
    getDropbackFilterConfig(DEFAULT_SEASON_TYPE).defaultMin
  );

  const dropbackConfig = getDropbackFilterConfig(seasonType);

  const seasonFilteredQbs = useMemo(
    () =>
      qbs.filter(
        (qb) => qb.season === season && qb.season_type === seasonType
      ),
    [qbs, season, seasonType]
  );

  const maxDropbacks = useMemo(() => {
    if (seasonFilteredQbs.length === 0) {
      return dropbackConfig.defaultMin;
    }

    const peak = Math.max(
      ...seasonFilteredQbs.map((qb) => qb.total_dropbacks ?? 0)
    );

    return Math.max(peak, dropbackConfig.defaultMin);
  }, [seasonFilteredQbs, dropbackConfig.defaultMin]);

  useEffect(() => {
    const nextDefault = Math.min(dropbackConfig.defaultMin, maxDropbacks);
    setMinDropbacks(nextDefault);
  }, [season, seasonType, dropbackConfig.defaultMin, maxDropbacks]);

  const filteredQbs = useMemo(
    () =>
      seasonFilteredQbs.filter(
        (qb) => (qb.total_dropbacks ?? 0) >= minDropbacks
      ),
    [seasonFilteredQbs, minDropbacks]
  );

  return {
    season,
    setSeason,
    seasonType,
    setSeasonType,
    minDropbacks,
    setMinDropbacks,
    maxDropbacks,
    dropbackStep: dropbackConfig.step,
    dropbackMin: dropbackConfig.min,
    filteredQbs,
  };
}
