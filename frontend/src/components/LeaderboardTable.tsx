import type { QBRecord } from "../api/client";

type Props = {
  qbs: QBRecord[];
};

function LeaderboardTable({ qbs }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>QB</th>
          <th>Team</th>
          <th>Season</th>
          <th>Type</th>
          <th>Dropbacks</th>
          <th>Score</th>
        </tr>
      </thead>

      <tbody>
        {qbs.map((qb) => (
          <tr key={`${qb.player_display_name}-${qb.season}-${qb.season_type}`}>
            <td>{qb.adjusted_cortisol_rank}</td>
            <td>{qb.player_display_name}</td>
            <td>{qb.team}</td>
            <td>{qb.season}</td>
            <td>{qb.season_type}</td>
            <td>{qb.total_dropbacks}</td>
            <td>{(qb.adjusted_cortisol_score * 100).toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LeaderboardTable;