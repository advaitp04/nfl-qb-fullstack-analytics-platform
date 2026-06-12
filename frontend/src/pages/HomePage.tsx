import { useEffect, useMemo } from "react";
import FilterPanel from "../components/filters/FilterPanel";
import AppHeader from "../components/layout/AppHeader";
import PageLayout from "../components/layout/PageLayout";
import LeaderboardSection from "../components/leaderboard/LeaderboardSection";
import QbComparisonSection from "../components/comparison/QbComparisonSection";
import AlertMessage from "../components/ui/AlertMessage";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import { useLeaderboardFilters } from "../hooks/useLeaderboardFilters";
import { useQbComparisonSelection } from "../hooks/useQbComparisonSelection";
import { useQbs } from "../hooks/useQbs";
import { toLeaderboardRows } from "../utils/qbTransformations";

function HomePage() {
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
    setQbs,
    filteredQbs,
  } = useLeaderboardFilters();

  const { qbs, loading, error } = useQbs({
    season,
    season_type: seasonType,
  });

  useEffect(() => {
    setQbs(qbs);
  }, [qbs, setQbs]);

  const { qb1, qb2, setQb1, setQb2, canCompare } =
    useQbComparisonSelection(filteredQbs);

  const leaderboardRows = useMemo(
    () => toLeaderboardRows(filteredQbs),
    [filteredQbs]
  );

  const sidebar = (
    <>
      <FilterPanel
        season={season}
        onSeasonChange={setSeason}
        seasonType={seasonType}
        onSeasonTypeChange={setSeasonType}
        minDropbacks={minDropbacks}
        onMinDropbacksChange={setMinDropbacks}
        maxDropbacks={maxDropbacks}
        dropbackMin={dropbackMin}
        dropbackStep={dropbackStep}
      />
      {!loading && filteredQbs.length === 0 && (
        <AlertMessage
          tone="warning"
          message="No quarterbacks meet the current filter criteria. Try lowering the minimum dropbacks."
        />
      )}
    </>
  );

  const main = (
    <>
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      {!loading && !error && filteredQbs.length > 0 && (
        <>
          <LeaderboardSection rows={leaderboardRows} />
          <QbComparisonSection
            qbs={filteredQbs}
            qb1={qb1}
            qb2={qb2}
            onQb1Change={setQb1}
            onQb2Change={setQb2}
            canCompare={canCompare}
          />
        </>
      )}
    </>
  );

  return (
    <PageLayout
      header={
        <AppHeader title="NFL QB Cortisol Index Analytics" />
      }
      main={main}
      sidebar={sidebar}
    />
  );
}

export default HomePage;
