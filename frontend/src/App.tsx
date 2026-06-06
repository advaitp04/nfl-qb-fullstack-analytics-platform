import { useEffect, useState } from "react";
import { fetchQbs, type QBRecord} from "./api/client";
import "./App.css";
import LeaderboardTable from "./components/LeaderboardTable";

function App() {
  const [qbs, setQbs] = useState<QBRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [season, setSeason] = useState(2023);
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
        <div>
        <label>
          Season{" "}
          <select
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
          >
            {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label>
          Season Type{" "}
          <select
            value={seasonType}
            onChange={(e) => setSeasonType(e.target.value as "REG" | "POST")}
          >
            <option value="REG">Regular Season</option>
            <option value="POST">Playoffs</option>
          </select>
        </label>
      </div>
      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      <LeaderboardTable qbs={qbs} />
    </main>
  );
}

export default App;