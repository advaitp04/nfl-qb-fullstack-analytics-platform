import type { SeasonType } from "../types/api";

export const AVAILABLE_SEASONS = [
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
  2013, 2012, 2011, 2010,
] as const;

export const DEFAULT_SEASON = 2025;
export const DEFAULT_SEASON_TYPE: SeasonType = "REG";

export const SEASON_TYPE_LABELS: Record<SeasonType, string> = {
  REG: "Regular Season",
  POST: "Playoffs",
};

export interface DropbackFilterConfig {
  defaultMin: number;
  min: number;
  step: number;
}

export function getDropbackFilterConfig(
  seasonType: SeasonType
): DropbackFilterConfig {
  if (seasonType === "REG") {
    return { defaultMin: 200, min: 50, step: 10 };
  }

  return { defaultMin: 30, min: 1, step: 5 };
}
