import { useMemo, useState } from "react";
import type { LeaderboardRow } from "../../utils/qbTransformations";
import { scoreToGradientColor } from "../../utils/qbTransformations";

type Props = {
  rows: LeaderboardRow[];
};

type SortDirection = "asc" | "desc";
type SortKey = keyof LeaderboardRow;

function getCortisolCellStyle(score: number, min: number, max: number) {
  const normalized =
    max === min ? 0.5 : Math.max(0, Math.min(1, (score - min) / (max - min)));
  const distanceFromMiddle = Math.abs(normalized - 0.5) * 2;
  const hue = normalized * 120;
  const saturation = 32 + distanceFromMiddle * 38;
  const lightness = 86 - distanceFromMiddle * 46;
  const isDark = lightness < 58;

  return {
    backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    color: isDark ? "#ffffff" : "#1f2937",
    fontWeight: 700,
    textShadow: isDark ? "0 1px 1px rgba(0, 0, 0, 0.35)" : "none",
  };
}

function LeaderboardTable({ rows }: Props) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (nextSortKey: SortKey) => {
    if (sortKey === nextSortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection("asc");
  };

  const getHeaderClassName = (headerSortKey: SortKey) =>
    `leaderboard-table__sortable-header${
      sortKey === headerSortKey ? " leaderboard-table__sortable-header--active" : ""
    }`;

  const renderSortIndicator = (headerSortKey: SortKey) =>
    sortKey === headerSortKey ? (
      <span className="leaderboard-table__sort-indicator">
        {sortDirection}
      </span>
    ) : null;

  const displayRows = useMemo(() => {
    if (!sortKey) {
      return rows;
    }

    return [...rows].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      const comparison =
        typeof aValue === "string" && typeof bValue === "string"
          ? aValue.localeCompare(bValue)
          : Number(aValue) - Number(bValue);

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [rows, sortDirection, sortKey]);

  const stabilizedCortisolScores = displayRows.map(
    (row) => row.stabilizedCortisolScore
  );
  const cortisolScores = displayRows.map((row) => row.cortisolScore);
  const minStabilizedCortisolScore = Math.min(...stabilizedCortisolScores);
  const maxStabilizedCortisolScore = Math.max(...stabilizedCortisolScores);
  const minCortisolScore = Math.min(...cortisolScores);
  const maxCortisolScore = Math.max(...cortisolScores);

  return (
    <div className="leaderboard-table-wrapper">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th
              className={getHeaderClassName("stabilizedRank")}
              title="Rank based on the adjusted Cortisol Score, which accounts for total dropbacks during the regular season"
              onClick={() => handleSort("stabilizedRank")}
            >
              Stabilized Rank
              {renderSortIndicator("stabilizedRank")}
            </th>
            <th
              className={getHeaderClassName("qbName")}
              title="Quarterback Name"
              onClick={() => handleSort("qbName")}
            >
              QB Name
              {renderSortIndicator("qbName")}
            </th>
            <th
              className={getHeaderClassName("team")}
              title="Team of Quarterback"
              onClick={() => handleSort("team")}
            >
              Team
              {renderSortIndicator("team")}
            </th>
            <th
              className={getHeaderClassName("stabilizedCortisolScore")}
              title="Adjusted Cortisol Score, which accounts for total dropbacks during the regular season"
              onClick={() => handleSort("stabilizedCortisolScore")}
            >
              Stabilized Cortisol Score
              {renderSortIndicator("stabilizedCortisolScore")}
            </th>
            <th
              className={getHeaderClassName("cortisolScore")}
              title="Cortisol Score calculated based on the average of the turnover, drive, & success scores"
              onClick={() => handleSort("cortisolScore")}
            >
              Cortisol Score
              {renderSortIndicator("cortisolScore")}
            </th>
            <th
              className={getHeaderClassName("dropbacks")}
              title="Total number of plays designed as a pass for a QB during the regular season"
              onClick={() => handleSort("dropbacks")}
            >
              Dropbacks
              {renderSortIndicator("dropbacks")}
            </th>
            <th
              className={getHeaderClassName("turnoverScore")}
              title="Average of normalized turnover/drive-killer factors: INT rate, fumble-lost rate, sack rate, and sack-yards-per-sack"
              onClick={() => handleSort("turnoverScore")}
            >
              Turnover Score
              {renderSortIndicator("turnoverScore")}
            </th>
            <th
              className={getHeaderClassName("driveScore")}
              title="Average of normalized drive-sustainability factors: first-down rate and completion rate"
              onClick={() => handleSort("driveScore")}
            >
              Drive Score
              {renderSortIndicator("driveScore")}
            </th>
            <th
              className={getHeaderClassName("successScore")}
              title="Average of normalized offensive-success factors: TD per attempt, EPA per dropback, and yards per attempt"
              onClick={() => handleSort("successScore")}
            >
              Success Score
              {renderSortIndicator("successScore")}
            </th>
            <th
              className={getHeaderClassName("rank")}
              title="Rank based on the Cortisol Score, which is calculated based on the average of the turnover, drive, & success scores"
              onClick={() => handleSort("rank")}
            >
              Rank
              {renderSortIndicator("rank")}
            </th>
          </tr>
        </thead>

        <tbody>
          {displayRows.map((row) => (
            <tr key={`${row.qbName}-${row.stabilizedRank}`}>
              <td>{row.stabilizedRank}</td>
              <td>{row.qbName}</td>
              <td>{row.team}</td>
              <td
                style={getCortisolCellStyle(
                  row.stabilizedCortisolScore,
                  minStabilizedCortisolScore,
                  maxStabilizedCortisolScore
                )}
              >
                {row.stabilizedCortisolScore.toFixed(1)}
              </td>
              <td
                style={getCortisolCellStyle(
                  row.cortisolScore,
                  minCortisolScore,
                  maxCortisolScore
                )}
              >
                {row.cortisolScore.toFixed(1)}
              </td>
              <td>{row.dropbacks}</td>
              <td
                style={{
                  backgroundColor: scoreToGradientColor(
                    row.turnoverScore,
                    "blue"
                  ),
                }}
              >
                {row.turnoverScore.toFixed(3)}
              </td>
              <td
                style={{
                  backgroundColor: scoreToGradientColor(row.driveScore, "blue"),
                }}
              >
                {row.driveScore.toFixed(3)}
              </td>
              <td
                style={{
                  backgroundColor: scoreToGradientColor(
                    row.successScore,
                    "blue"
                  ),
                }}
              >
                {row.successScore.toFixed(3)}
              </td>
              <td>{row.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderboardTable;
