import type { QbComparisonMetrics } from "../../utils/qbTransformations";
import { formatNumber } from "../../utils/metricFormatters";

type Props = {
  metrics: QbComparisonMetrics;
  scoreDelta: number;
};

function QbMetricCard({ metrics, scoreDelta }: Props) {
  const deltaPrefix = scoreDelta > 0 ? "+" : "";

  return (
    <article className="qb-metric-card">
      <h3>
        {metrics.name} ({metrics.team})
      </h3>

      <div className="qb-metric-card__metric">
        <span className="qb-metric-card__label">Stabilized Score</span>
        <strong>{metrics.stabilizedScore.toFixed(1)}</strong>
        <span className="qb-metric-card__delta">
          {deltaPrefix}
          {scoreDelta.toFixed(1)}
        </span>
      </div>

      <div className="qb-metric-card__metric">
        <span className="qb-metric-card__label">Stabilized Rank</span>
        <strong>{formatNumber(metrics.stabilizedRank)}</strong>
      </div>

      <div className="qb-metric-card__metric">
        <span className="qb-metric-card__label">Dropbacks</span>
        <strong>{formatNumber(metrics.dropbacks)}</strong>
      </div>
    </article>
  );
}

export default QbMetricCard;
