import type { LeaderboardRow } from "../../utils/qbTransformations";
import { scoreToGradientColor } from "../../utils/qbTransformations";

type Props = {
  rows: LeaderboardRow[];
};

function LeaderboardTable({ rows }: Props) {
  return (
    <div className="leaderboard-table-wrapper">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th title="Rank based on the adjusted Cortisol Score, which accounts for total dropbacks during the regular season">
              Stabilized Rank
            </th>
            <th title="Quarterback Name">QB Name</th>
            <th title="Team of Quarterback">Team</th>
            <th title="Adjusted Cortisol Score, which accounts for total dropbacks during the regular season">
              Stabilized Cortisol Score
            </th>
            <th title="Cortisol Score calculated based on the average of the turnover, drive, & success scores">
              Cortisol Score
            </th>
            <th title="Total number of plays designed as a pass for a QB during the regular season">
              Dropbacks
            </th>
            <th title="Average of normalized turnover/drive-killer factors: INT rate, fumble-lost rate, sack rate, and sack-yards-per-sack">
              Turnover Score
            </th>
            <th title="Average of normalized drive-sustainability factors: first-down rate and completion rate">
              Drive Score
            </th>
            <th title="Average of normalized offensive-success factors: TD per attempt, EPA per dropback, and yards per attempt">
              Success Score
            </th>
            <th title="Rank based on the Cortisol Score, which is calculated based on the average of the turnover, drive, & success scores">
              Rank
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
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
