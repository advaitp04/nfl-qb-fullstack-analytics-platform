import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_SEASON,
  DEFAULT_SEASON_TYPE,
  getDropbackFilterConfig,
} from "../constants/filters";
import type { AdvancedMetricsRecord, SeasonType } from "../types/api";

interface UseAdvancedMetricsFiltersResult {
  season: number;
  setSeason: (season: number) => void;
  seasonType: SeasonType;
  setSeasonType: (seasonType: SeasonType) => void;
  minDropbacks: number;
  setMinDropbacks: (value: number) => void;
  maxDropbacks: number;
  dropbackStep: number;
  dropbackMin: number;
  topN: number;
  setTopN: (value: number) => void;
  setRecords: (records: AdvancedMetricsRecord[]) => void;
  filteredRecords: AdvancedMetricsRecord[];
}

export function useAdvancedMetricsFilters(): UseAdvancedMetricsFiltersResult {
  const [records, setRecords] = useState<AdvancedMetricsRecord[]>([]);
  const [season, setSeason] = useState(DEFAULT_SEASON);
  const [seasonType, setSeasonType] = useState<SeasonType>(DEFAULT_SEASON_TYPE);
  const [minDropbacks, setMinDropbacks] = useState(
    getDropbackFilterConfig(DEFAULT_SEASON_TYPE).defaultMin
  );
  const [topN, setTopN] = useState(10);

  const dropbackConfig = getDropbackFilterConfig(seasonType);

  const maxDropbacks = useMemo(() => {
    if (records.length === 0) {
      return dropbackConfig.defaultMin;
    }

    const peak = Math.max(
      ...records.map((record) => record.total_dropbacks ?? 0)
    );

    return Math.max(peak, dropbackConfig.defaultMin);
  }, [records, dropbackConfig.defaultMin]);

  useEffect(() => {
    const nextDefault = Math.min(dropbackConfig.defaultMin, maxDropbacks);
    setMinDropbacks(nextDefault);
  }, [season, seasonType, dropbackConfig.defaultMin, maxDropbacks]);

  const filteredRecords = useMemo(
    () =>
      records.filter(
        (record) => (record.total_dropbacks ?? 0) >= minDropbacks
      ),
    [records, minDropbacks]
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
    topN,
    setTopN,
    setRecords,
    filteredRecords,
  };
}
