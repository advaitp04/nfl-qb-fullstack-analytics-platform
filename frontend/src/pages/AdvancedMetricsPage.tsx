import { useEffect } from "react";
import AdvancedMetricsFilterPanel from "../components/advanced/AdvancedMetricsFilterPanel";
import AppHeader from "../components/layout/AppHeader";
import PageLayout from "../components/layout/PageLayout";
import AlertMessage from "../components/ui/AlertMessage";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import { useAdvancedMetrics } from "../hooks/useAdvancedMetrics";
import { useAdvancedMetricsFilters } from "../hooks/useAdvancedMetricsFilters";

function AdvancedMetricsPage() {
  const {
    season,
    setSeason,
    seasonType,
    setSeasonType,
    minDropbacks,
    setMinDropbacks,
    maxDropbacks,
    dropbackStep,
    dropbackMin,
    topN,
    setTopN,
    setRecords,
    filteredRecords,
  } = useAdvancedMetricsFilters();

  const { records, loading, error } = useAdvancedMetrics({
    season,
    season_type: seasonType,
  });

  useEffect(() => {
    setRecords(records);
  }, [records, setRecords]);

  const previewRecords = filteredRecords.slice(0, topN);

  const sidebar = (
    <>
      <AdvancedMetricsFilterPanel
        season={season}
        onSeasonChange={setSeason}
        seasonType={seasonType}
        onSeasonTypeChange={setSeasonType}
        minDropbacks={minDropbacks}
        onMinDropbacksChange={setMinDropbacks}
        maxDropbacks={maxDropbacks}
        dropbackMin={dropbackMin}
        dropbackStep={dropbackStep}
        topN={topN}
        onTopNChange={setTopN}
      />
      {!loading && filteredRecords.length === 0 && (
        <AlertMessage
          tone="warning"
          message="No quarterbacks meet the current advanced metrics filters. Try lowering the minimum dropbacks."
        />
      )}
    </>
  );

  const main = (
    <>
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      {!loading && !error && filteredRecords.length > 0 && (
        <section className="advanced-metrics-preview">
          <h2>QB Advanced Metrics</h2>
          <p>
            Showing {previewRecords.length} of {filteredRecords.length} QBs
            matching the current filters.
          </p>

          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>QB Name</th>
                  <th>Team</th>
                  <th>Dropbacks</th>
                  <th>Negative EPA Rate</th>
                  <th>Panic Play Rate</th>
                  <th>Redzone TD Rate</th>
                </tr>
              </thead>
              <tbody>
                {previewRecords.map((record) => (
                  <tr
                    key={`${record.player_display_name}-${record.team}-${record.season}`}
                  >
                    <td>{record.player_display_name ?? "Unknown"}</td>
                    <td>{record.team ?? "—"}</td>
                    <td>{record.total_dropbacks ?? 0}</td>
                    <td>{((record.negative_epa_rate ?? 0) * 100).toFixed(1)}</td>
                    <td>{((record.panic_play_rate ?? 0) * 100).toFixed(1)}</td>
                    <td>{((record.redzone_td_rate ?? 0) * 100).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );

  return (
    <PageLayout
      header={<AppHeader title="QB Advanced Metrics" />}
      main={main}
      sidebar={sidebar}
    />
  );
}

export default AdvancedMetricsPage;
