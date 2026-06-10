import InfoAccordion from "./InfoAccordion";
import LeaderboardTable from "./LeaderboardTable";
import type { LeaderboardRow } from "../../utils/qbTransformations";

type Props = {
  rows: LeaderboardRow[];
};

function LeaderboardSection({ rows }: Props) {
  return (
    <section className="leaderboard-section">
      <InfoAccordion />
      <h2>NFL QB Cortisol Index Leaderboard</h2>
      <LeaderboardTable rows={rows} />
    </section>
  );
}

export default LeaderboardSection;
