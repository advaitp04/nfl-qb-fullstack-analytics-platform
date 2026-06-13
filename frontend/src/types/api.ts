/** Mirrors backend/models/schemas.py — keep in sync with Pydantic models. */

export type SeasonType = "REG" | "POST";

export interface QBRecord {
  player_display_name?: string | null;
  season?: number | null;
  season_type?: string | null;
  team?: string | null;
  total_dropbacks?: number | null;
  adjusted_cortisol_score?: number | null;
  adjusted_cortisol_rank?: number | null;
  cortisol_score?: number | null;
  cortisol_rank?: number | null;
  turnover_score?: number | null;
  drive_score?: number | null;
  success_score?: number | null;
}

export interface AdvancedMetricsRecord {
  player_display_name?: string | null;
  season?: number | null;
  season_type?: string | null;
  team?: string | null;
  epa_per_dropback?: number | null;
  redzone_td_rate?: number | null;
  third_down_conversion_rate?: number | null;
  third_down_regular_conversion_rate?: number | null;
  third_and_long_conversion_rate?: number | null;
  adjusted_cortisol_score?: number | null;
  adjusted_cortisol_rank?: number | null;
  total_dropbacks?: number | null;
  turnover_score?: number | null;
  drive_score?: number | null;
  success_score?: number | null;
  negative_epa_rate?: number | null;
  panic_play_rate?: number | null;
}

export interface QBListResponse {
  count: number;
  results: QBRecord[];
}

export interface AdvancedMetricsListResponse {
  count: number;
  results: AdvancedMetricsRecord[];
}

export interface HealthResponse {
  status: string;
  service: string;
}

export interface FetchQbsParams {
  season?: number;
  season_type?: SeasonType;
  team?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
