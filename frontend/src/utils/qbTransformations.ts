import type { QBRecord } from "../types/api";

export interface LeaderboardRow {
  stabilizedRank: number;
  qbName: string;
  team: string;
  stabilizedCortisolScore: number;
  cortisolScore: number;
  dropbacks: number;
  turnoverScore: number;
  driveScore: number;
  successScore: number;
  rank: number;
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function scaleScore(value: number | null | undefined): number {
  if (value == null) {
    return 0;
  }

  return value * 100;
}

export function toLeaderboardRow(qb: QBRecord): LeaderboardRow {
  return {
    stabilizedRank: qb.adjusted_cortisol_rank ?? 0,
    qbName: qb.player_display_name ?? "Unknown",
    team: qb.team ?? "—",
    stabilizedCortisolScore: scaleScore(qb.adjusted_cortisol_score),
    cortisolScore: scaleScore(qb.cortisol_score),
    dropbacks: qb.total_dropbacks ?? 0,
    turnoverScore: scaleScore(round(qb.turnover_score ?? 0, 3)),
    driveScore: scaleScore(round(qb.drive_score ?? 0, 3)),
    successScore: scaleScore(round(qb.success_score ?? 0, 3)),
    rank: qb.cortisol_rank ?? 0,
  };
}

export function toLeaderboardRows(qbs: QBRecord[]): LeaderboardRow[] {
  return qbs
    .map(toLeaderboardRow)
    .sort((a, b) => a.stabilizedRank - b.stabilizedRank);
}

export function getUniqueQbNames(qbs: QBRecord[]): string[] {
  const names = new Set<string>();

  qbs.forEach((qb) => {
    if (qb.player_display_name) {
      names.add(qb.player_display_name);
    }
  });

  return [...names].sort((a, b) => a.localeCompare(b));
}

export function findQbByName(
  qbs: QBRecord[],
  name: string
): QBRecord | undefined {
  return qbs.find((qb) => qb.player_display_name === name);
}

export interface QbComparisonMetrics {
  name: string;
  team: string;
  stabilizedScore: number;
  stabilizedRank: number;
  dropbacks: number;
  turnoverScore: number;
  driveScore: number;
  successScore: number;
}

export function toComparisonMetrics(qb: QBRecord): QbComparisonMetrics {
  return {
    name: qb.player_display_name ?? "Unknown",
    team: qb.team ?? "—",
    stabilizedScore: scaleScore(qb.adjusted_cortisol_score),
    stabilizedRank: qb.adjusted_cortisol_rank ?? 0,
    dropbacks: qb.total_dropbacks ?? 0,
    turnoverScore: scaleScore(qb.turnover_score),
    driveScore: scaleScore(qb.drive_score),
    successScore: scaleScore(qb.success_score),
  };
}

export function scoreToGradientColor(
  score: number,
  palette: "green-red" | "blue" = "green-red"
): string {
  const normalized = Math.max(0, Math.min(100, score)) / 100;

  if (palette === "blue") {
    const lightness = 92 - normalized * 42;
    return `hsl(210, 70%, ${lightness}%)`;
  }

  const hue = normalized * 120;
  return `hsl(${hue}, 65%, 82%)`;
}
