import { useEffect, useState } from "react";
import { fetchQbs, type QBRecord} from "./api/client";
import "./App.css";
import Filters from "./components/Filters";
import LeaderboardTable from "./components/LeaderboardTable";
import InfoAccordion from "./components/InfoAccordion";

function App() {
  const [qbs, setQbs] = useState<QBRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [season, setSeason] = useState(2025);
  const [seasonType, setSeasonType] = useState<"REG" | "POST">("REG");

  useEffect(() => {
    async function loadQbs() {
      try {
        setLoading(true);

        const data = await fetchQbs({
          season: season,
          season_type: seasonType,
          limit: 25,
          sort_by: "adjusted_cortisol_score",
          sort_order: "desc",
        });

        setQbs(data.results);
      } catch (err) {
        setError("Failed to load QB data");
      } finally {
        setLoading(false);
      }
    }

    loadQbs();
  }, [season, seasonType]);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>NFL QB Cortisol Index</h1>
      <InfoAccordion/>
      <Filters
        season={season}
        setSeason={setSeason}
        seasonType={seasonType}
        setSeasonType={setSeasonType}
      />
      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      <LeaderboardTable qbs={qbs} />
    </main>
  );
}

export default App;