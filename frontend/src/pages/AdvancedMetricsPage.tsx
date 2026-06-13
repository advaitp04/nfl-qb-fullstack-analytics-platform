import { useEffect } from "react";
import AdvancedMetricsFilterPanel from "../components/advanced/AdvancedMetricsFilterPanel";
import AdvancedMetricsInfoAccordion from "../components/advanced/AdvancedMetricsInfoAccordion";
import AdvancedQbComparisonSection from "../components/advanced/AdvancedQbComparisonSection";
import QbPressureProfile from "../components/advanced/QbPressureProfile";
import RedzoneTdLeadersChart from "../components/advanced/RedzoneTdLeadersChart";
import ThirdDownPerformanceChart from "../components/advanced/ThirdDownPerformanceChart";
import VolatilityEfficiencyChart from "../components/advanced/VolatilityEfficiencyChart";
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
        <>
          <AdvancedMetricsInfoAccordion />
          <VolatilityEfficiencyChart records={filteredRecords} />
          <AdvancedQbComparisonSection records={filteredRecords} />
          <RedzoneTdLeadersChart records={filteredRecords} topN={topN} />
          <ThirdDownPerformanceChart records={filteredRecords} topN={topN} />
          <QbPressureProfile records={filteredRecords} />
        </>
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
