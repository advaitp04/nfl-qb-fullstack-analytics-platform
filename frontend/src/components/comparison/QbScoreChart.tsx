import type { QbComparisonMetrics } from "../../utils/qbTransformations";

type Props = {
  qb1: QbComparisonMetrics;
  qb2: QbComparisonMetrics;
};

const METRICS = ["Turnover", "Drive", "Success"] as const;
const CHART_HEIGHT = 420;
const BAR_WIDTH = 34;
const GROUP_GAP = 72;
const BAR_GAP = 8;

function QbScoreChart({ qb1, qb2 }: Props) {
  const groups = METRICS.map((metric, index) => ({
    metric,
    x: index * GROUP_GAP + 24,
    bars: [
      { qb: qb1.name, score: getMetricScore(qb1, metric), color: "#d6f0ff" },
      { qb: qb2.name, score: getMetricScore(qb2, metric), color: "#0b3d91" },
    ],
  }));

  const chartWidth = METRICS.length * GROUP_GAP + 48;

  return (
    <figure className="qb-score-chart">
      <div className="qb-score-chart__legend">
        <span className="qb-score-chart__legend-item">
          <span
            className="qb-score-chart__swatch"
            style={{ backgroundColor: "#d6f0ff" }}
          />
          {qb1.name}
        </span>
        <span className="qb-score-chart__legend-item">
          <span
            className="qb-score-chart__swatch"
            style={{ backgroundColor: "#0b3d91" }}
          />
          {qb2.name}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
        role="img"
        aria-label={`Comparison chart for ${qb1.name} and ${qb2.name}`}
      >
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = CHART_HEIGHT - 48 - tick * 3;
          return (
            <g key={tick}>
              <line
                x1="16"
                x2={chartWidth - 16}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.25)"
              />
              <text
                x="0"
                y={y + 4}
                fill="white"
                fontSize="12"
              >
                {tick.toFixed(0)}
              </text>
            </g>
          );
        })}

        {groups.map(({ metric, x, bars }) => (
          <g key={metric}>
            {bars.map((bar, barIndex) => {
              const barHeight = Math.max(0, bar.score) * 3;
              const barX = x + barIndex * (BAR_WIDTH + BAR_GAP);
              const barY = CHART_HEIGHT - 48 - barHeight;

              return (
                <g key={`${metric}-${bar.qb}`}>
                  <rect
                    x={barX}
                    y={barY}
                    width={BAR_WIDTH}
                    height={barHeight}
                    fill={bar.color}
                    rx="4"
                  />
                  <text
                    x={barX + BAR_WIDTH / 2}
                    y={barY - 8}
                    fill="white"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {bar.score.toFixed(3)}
                  </text>
                </g>
              );
            })}
            <text
              x={x + BAR_WIDTH + BAR_GAP / 2}
              y={CHART_HEIGHT - 16}
              fill="white"
              fontSize="13"
              textAnchor="middle"
            >
              {metric}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

function getMetricScore(
  qb: QbComparisonMetrics,
  metric: (typeof METRICS)[number]
): number {
  if (metric === "Turnover") {
    return qb.turnoverScore;
  }

  if (metric === "Drive") {
    return qb.driveScore;
  }

  return qb.successScore;
}

export default QbScoreChart;
