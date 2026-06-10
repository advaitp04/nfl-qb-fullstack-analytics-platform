import AlertMessage from "../ui/AlertMessage";
import QbComparisonCards from "./QbComparisonCards";
import QbScoreChart from "./QbScoreChart";
import QbSelect from "./QbSelect";
import {
  findQbByName,
  getUniqueQbNames,
  toComparisonMetrics,
} from "../../utils/qbTransformations";
import type { QBRecord } from "../../types/api";

type Props = {
  qbs: QBRecord[];
  qb1: string;
  qb2: string;
  onQb1Change: (name: string) => void;
  onQb2Change: (name: string) => void;
  canCompare: boolean;
};

function QbComparisonSection({
  qbs,
  qb1,
  qb2,
  onQb1Change,
  onQb2Change,
  canCompare,
}: Props) {
  const qbNames = getUniqueQbNames(qbs);

  if (!canCompare) {
    return (
      <section className="comparison-section">
        <h2>QB Comparison</h2>
        <AlertMessage
          tone="info"
          message="Only one QB matches the current filters. Lower the minimum dropbacks to compare multiple QBs."
        />
      </section>
    );
  }

  const qb1Record = findQbByName(qbs, qb1);
  const qb2Record = findQbByName(qbs, qb2);

  if (!qb1Record || !qb2Record) {
    return null;
  }

  const qb1Metrics = toComparisonMetrics(qb1Record);
  const qb2Metrics = toComparisonMetrics(qb2Record);

  return (
    <section className="comparison-section">
      <h2>QB Comparison</h2>

      <div className="comparison-section__selectors">
        <QbSelect
          label="Select QB 1 for chart"
          qbNames={qbNames}
          selectedQb={qb1}
          onChange={onQb1Change}
        />
        <QbSelect
          label="Select QB 2 for chart"
          qbNames={qbNames}
          selectedQb={qb2}
          onChange={onQb2Change}
        />
      </div>

      <QbComparisonCards qb1={qb1Metrics} qb2={qb2Metrics} />
      <QbScoreChart qb1={qb1Metrics} qb2={qb2Metrics} />
    </section>
  );
}

export default QbComparisonSection;
