import { useEffect, useState } from "react";
import QbSelect from "../comparison/QbSelect";
import AlertMessage from "../ui/AlertMessage";
import type { AdvancedMetricsRecord } from "../../types/api";
import { formatNumber } from "../../utils/metricFormatters";

type Props = {
  records: AdvancedMetricsRecord[];
};

type AdvancedComparisonMetrics = {
  name: string;
  team: string;
  stabilizedRating: number;
  stabilizedRank: number;
  dropbacks: number;
  downToDownSustainability: number;
  pressureComposure: number;
  thirdDownExecution: number;
  thirdAndLongExecution: number;
  redzoneTdRate: number;
};

const CHART_HEIGHT = 380;
const BAR_WIDTH = 42;
const BAR_GAP = 16;
const GROUP_GAP = 150;
const PLOT_TOP = 28;
const PLOT_BOTTOM = 58;
const PLOT_LEFT = 42;
const PLOT_RIGHT = 24;
const PLOT_HEIGHT = CHART_HEIGHT - PLOT_TOP - PLOT_BOTTOM;

const CHART_METRICS = [
  {
    key: "downToDownSustainability",
    label: "Down",
  },
  {
    key: "pressureComposure",
    label: "Pressure",
  },
  {
    key: "thirdDownExecution",
    label: "3rd Down",
  },
  {
    key: "thirdAndLongExecution",
    label: "3rd & Long",
  },
  {
    key: "redzoneTdRate",
    label: "Redzone TD",
  },
] as const;

function toScore(value: number | null | undefined): number {
  return (value ?? 0) * 100;
}

function toHigherIsBetter(value: number | null | undefined): number {
  return (1 - (value ?? 0)) * 100;
}

function getUniqueQbNames(records: AdvancedMetricsRecord[]): string[] {
  const names = new Set<string>();

  records.forEach((record) => {
    if (record.player_display_name) {
      names.add(record.player_display_name);
    }
  });

  return [...names].sort((a, b) => a.localeCompare(b));
}

function findRecordByName(
  records: AdvancedMetricsRecord[],
  name: string
): AdvancedMetricsRecord | undefined {
  return records.find((record) => record.player_display_name === name);
}

function toMetrics(record: AdvancedMetricsRecord): AdvancedComparisonMetrics {
  return {
    name: record.player_display_name ?? "Unknown",
    team: record.team ?? "—",
    stabilizedRating: toScore(record.adjusted_cortisol_score),
    stabilizedRank: record.adjusted_cortisol_rank ?? 0,
    dropbacks: record.total_dropbacks ?? 0,
    downToDownSustainability: toHigherIsBetter(record.negative_epa_rate),
    pressureComposure: toHigherIsBetter(record.panic_play_rate),
    thirdDownExecution: toScore(record.third_down_conversion_rate),
    thirdAndLongExecution: toScore(record.third_and_long_conversion_rate),
    redzoneTdRate: toScore(record.redzone_td_rate),
  };
}

function getY(score: number): number {
  const boundedScore = Math.max(0, Math.min(100, score));
  return PLOT_TOP + (100 - boundedScore) * (PLOT_HEIGHT / 100);
}

function AdvancedQbComparisonSection({ records }: Props) {
  const qbNames = getUniqueQbNames(records);
  const [qb1, setQb1] = useState("");
  const [qb2, setQb2] = useState("");

  useEffect(() => {
    if (qbNames.length === 0) {
      setQb1("");
      setQb2("");
      return;
    }

    setQb1((current) =>
      current && qbNames.includes(current) ? current : qbNames[0]
    );
    setQb2((current) => {
      if (current && qbNames.includes(current) && current !== qbNames[0]) {
        return current;
      }

      return qbNames[1] ?? qbNames[0];
    });
  }, [qbNames]);

  if (qbNames.length < 2) {
    return (
      <section className="comparison-section">
        <h2>Advanced QB Comparison</h2>
        <AlertMessage
          tone="info"
          message="Only one QB matches the current filters. Lower the minimum dropbacks to compare multiple QBs."
        />
      </section>
    );
  }

  const qb1Record = findRecordByName(records, qb1);
  const qb2Record = findRecordByName(records, qb2);

  if (!qb1Record || !qb2Record) {
    return (
      <section className="comparison-section">
        <h2>Advanced QB Comparison</h2>
        <AlertMessage
          tone="info"
          message="Choose two quarterbacks to view the advanced comparison."
        />
      </section>
    );
  }

  const qb1Metrics = toMetrics(qb1Record);
  const qb2Metrics = toMetrics(qb2Record);
  const chartWidth =
    PLOT_LEFT + CHART_METRICS.length * GROUP_GAP + PLOT_RIGHT;

  return (
    <section className="comparison-section">
      <h2>Advanced QB Comparison</h2>

      <div className="comparison-section__selectors">
        <QbSelect
          label="Select QB 1 for advanced comparison"
          qbNames={qbNames}
          selectedQb={qb1}
          onChange={setQb1}
        />
        <QbSelect
          label="Select QB 2 for advanced comparison"
          qbNames={qbNames}
          selectedQb={qb2}
          onChange={setQb2}
        />
      </div>

      <div className="qb-comparison-cards">
        <AdvancedMetricCard
          metrics={qb1Metrics}
          ratingDelta={
            qb1Metrics.stabilizedRating - qb2Metrics.stabilizedRating
          }
        />
        <AdvancedMetricCard
          metrics={qb2Metrics}
          ratingDelta={
            qb2Metrics.stabilizedRating - qb1Metrics.stabilizedRating
          }
        />
      </div>

      <figure className="qb-score-chart advanced-qb-score-chart">
        <div className="qb-score-chart__legend">
          <span className="qb-score-chart__legend-item">
            <span
              className="qb-score-chart__swatch"
              style={{ backgroundColor: "#d6f0ff" }}
            />
            {qb1Metrics.name}
          </span>
          <span className="qb-score-chart__legend-item">
            <span
              className="qb-score-chart__swatch"
              style={{ backgroundColor: "#0b3d91" }}
            />
            {qb2Metrics.name}
          </span>
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
          role="img"
          aria-label={`Advanced comparison chart for ${qb1Metrics.name} and ${qb2Metrics.name}`}
        >
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = getY(tick);

            return (
              <g key={tick}>
                <line
                  x1={PLOT_LEFT}
                  x2={chartWidth - PLOT_RIGHT}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.22)"
                />
                <text
                  x={PLOT_LEFT - 10}
                  y={y + 4}
                  fill="white"
                  fontSize="12"
                  textAnchor="end"
                >
                  {tick}
                </text>
              </g>
            );
          })}
          <text
          x= "30"
          y={(CHART_HEIGHT / 2) - 11} 
          transform={`rotate(-90 20 ${CHART_HEIGHT / 2})`}
          textAnchor="middle"
          fill="white"
          fontSize={12}
          fontWeight="bold"
          >
          Percentile
        </text>

          <line
            x1={PLOT_LEFT}
            x2={PLOT_LEFT}
            y1={PLOT_TOP}
            y2={CHART_HEIGHT - PLOT_BOTTOM}
            stroke="rgba(255,255,255,0.35)"
          />

          {CHART_METRICS.map((metric, metricIndex) => {
            const x = PLOT_LEFT + metricIndex * GROUP_GAP + 28;
            const bars = [
              {
                label: qb1Metrics.name,
                score: qb1Metrics[metric.key],
                color: "#d6f0ff",
              },
              {
                label: qb2Metrics.name,
                score: qb2Metrics[metric.key],
                color: "#0b3d91",
              },
            ];

            return (
              <g key={metric.key}>
                {bars.map((bar, barIndex) => {
                  const barY = getY(bar.score);
                  const barHeight = CHART_HEIGHT - PLOT_BOTTOM - barY;
                  const barX = x + barIndex * (BAR_WIDTH + BAR_GAP);

                  return (
                    <g key={`${metric.key}-${barIndex}`}>
                      <rect
                        x={barX}
                        y={barY}
                        width={BAR_WIDTH}
                        height={barHeight}
                        fill={bar.color}
                        rx="6"
                      />
                      <text
                        x={barX + BAR_WIDTH / 2}
                        y={Math.max(PLOT_TOP - 8, barY - 10)}
                        fill="white"
                        fontSize="13"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {bar.score.toFixed(1)}
                      </text>
                      <title>
                        {`${bar.label} — ${metric.label}: ${bar.score.toFixed(
                          1
                        )}`}
                      </title>
                    </g>
                  );
                })}
                <text
                  x={x + BAR_WIDTH + BAR_GAP / 2}
                  y={CHART_HEIGHT - 20}
                  fill="white"
                  fontSize="14"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {metric.label}
                </text>
              </g>
            );
          })}
        </svg>
      </figure>
    </section>
  );
}

function AdvancedMetricCard({
  metrics,
  ratingDelta,
}: {
  metrics: AdvancedComparisonMetrics;
  ratingDelta: number;
}) {
  const deltaPrefix = ratingDelta > 0 ? "+" : "";

  return (
    <article className="qb-metric-card">
      <h3>
        {metrics.name} ({metrics.team})
      </h3>

      <div className="qb-metric-card__metric">
        <span className="qb-metric-card__label">Stabilized Rating</span>
        <strong>{metrics.stabilizedRating.toFixed(1)}</strong>
        <span className="qb-metric-card__delta">
          {deltaPrefix}
          {ratingDelta.toFixed(1)}
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

export default AdvancedQbComparisonSection;
