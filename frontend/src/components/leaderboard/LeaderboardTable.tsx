import { useMemo, useState } from "react";
import type { LeaderboardRow } from "../../utils/qbTransformations";
import { scoreToGradientColor } from "../../utils/qbTransformations";

type Props = {
  rows: LeaderboardRow[];
};

type SortDirection = "asc" | "desc";
type SortKey = keyof LeaderboardRow;

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

  return (
    <div className="leaderboard-table-wrapper">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th
              title="Rank based on the adjusted Cortisol Score, which accounts for total dropbacks during the regular season"
              onClick={() => handleSort("stabilizedRank")}
            >
              Stabilized Rank
            </th>
            <th title="Quarterback Name" onClick={() => handleSort("qbName")}>
              QB Name
            </th>
            <th title="Team of Quarterback" onClick={() => handleSort("team")}>
              Team
            </th>
            <th
              title="Adjusted Cortisol Score, which accounts for total dropbacks during the regular season"
              onClick={() => handleSort("stabilizedCortisolScore")}
            >
              Stabilized Cortisol Score
            </th>
            <th
              title="Cortisol Score calculated based on the average of the turnover, drive, & success scores"
              onClick={() => handleSort("cortisolScore")}
            >
              Cortisol Score
            </th>
            <th
              title="Total number of plays designed as a pass for a QB during the regular season"
              onClick={() => handleSort("dropbacks")}
            >
              Dropbacks
            </th>
            <th
              title="Average of normalized turnover/drive-killer factors: INT rate, fumble-lost rate, sack rate, and sack-yards-per-sack"
              onClick={() => handleSort("turnoverScore")}
            >
              Turnover Score
            </th>
            <th
              title="Average of normalized drive-sustainability factors: first-down rate and completion rate"
              onClick={() => handleSort("driveScore")}
            >
              Drive Score
            </th>
            <th
              title="Average of normalized offensive-success factors: TD per attempt, EPA per dropback, and yards per attempt"
              onClick={() => handleSort("successScore")}
            >
              Success Score
            </th>
            <th
              title="Rank based on the Cortisol Score, which is calculated based on the average of the turnover, drive, & success scores"
              onClick={() => handleSort("rank")}
            >
              Rank
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
                style={{
                  backgroundColor: scoreToGradientColor(
                    row.stabilizedCortisolScore,
                    "green-red"
                  ),
                }}
              >
                {row.stabilizedCortisolScore.toFixed(1)}
              </td>
              <td>{row.cortisolScore.toFixed(1)}</td>
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
