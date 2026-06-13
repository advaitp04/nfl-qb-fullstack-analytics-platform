import QbMetricCard from "./QbMetricCard";
import type { QbComparisonMetrics } from "../../utils/qbTransformations";

type Props = {
  qb1: QbComparisonMetrics;
  qb2: QbComparisonMetrics;
};

function QbComparisonCards({ qb1, qb2 }: Props) {
  return (
    <div className="qb-comparison-cards">
      <QbMetricCard
        metrics={qb1}
        scoreDelta={qb1.stabilizedScore - qb2.stabilizedScore}
      />
      <QbMetricCard
        metrics={qb2}
        scoreDelta={qb2.stabilizedScore - qb1.stabilizedScore}
      />
    </div>
  );
}

export default QbComparisonCards;
