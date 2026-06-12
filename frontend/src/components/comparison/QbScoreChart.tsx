import type { QbComparisonMetrics } from "../../utils/qbTransformations";

type Props = {
  qb1: QbComparisonMetrics;
  qb2: QbComparisonMetrics;
};

const METRICS = ["Turnover", "Drive", "Success"] as const;
const CHART_HEIGHT = 380;
const BAR_WIDTH = 42;
const GROUP_GAP = 150;
const BAR_GAP = 16;
const PLOT_TOP = 28;
const PLOT_RIGHT = 24;
const PLOT_BOTTOM = 58;
const PLOT_LEFT = 42;
const PLOT_HEIGHT = CHART_HEIGHT - PLOT_TOP - PLOT_BOTTOM;

function getY(score: number): number {
  const boundedScore = Math.max(0, Math.min(100, score));
  return PLOT_TOP + (100 - boundedScore) * (PLOT_HEIGHT / 100);
}

function QbScoreChart({ qb1, qb2 }: Props) {
  const groups = METRICS.map((metric, index) => ({
    metric,
    x: PLOT_LEFT + index * GROUP_GAP + 28,
    bars: [
      { qb: qb1.name, score: getMetricScore(qb1, metric), color: "#d6f0ff" },
      { qb: qb2.name, score: getMetricScore(qb2, metric), color: "#0b3d91" },
    ],
  }));

  const chartWidth = PLOT_LEFT + METRICS.length * GROUP_GAP + PLOT_RIGHT;

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
                x={PLOT_LEFT - 12}
                y={y + 4}
                fill="white"
                fontSize="12"
                textAnchor="end"
              >
                {tick.toFixed(0)}
              </text>
            </g>
          );
        })}

        <line
          x1={PLOT_LEFT}
          x2={PLOT_LEFT}
          y1={PLOT_TOP}
          y2={CHART_HEIGHT - PLOT_BOTTOM}
          stroke="rgba(255,255,255,0.35)"
        />

        {groups.map(({ metric, x, bars }) => (
          <g key={metric}>
            {bars.map((bar, barIndex) => {
              const barY = getY(bar.score);
              const barHeight = CHART_HEIGHT - PLOT_BOTTOM - barY;
              const barX = x + barIndex * (BAR_WIDTH + BAR_GAP);

              return (
                <g key={`${metric}-${barIndex}`}>
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
