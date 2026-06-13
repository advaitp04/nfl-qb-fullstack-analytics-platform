import type { AdvancedMetricsRecord } from "../../types/api";
import {
  formatNumber,
  formatPercentage,
  toPercentage,
} from "../../utils/metricFormatters";
import AlertMessage from "../ui/AlertMessage";

type Props = {
  records: AdvancedMetricsRecord[];
  topN: number;
};

const CHART_WIDTH = 720;
const ROW_HEIGHT = 38;
const PLOT_TOP = 48;
const PLOT_RIGHT = 32;
const PLOT_BOTTOM = 44;
const PLOT_LEFT = 190;

function ThirdDownPerformanceChart({ records, topN }: Props) {
  if (records.length === 0) {
    return (
      <section className="advanced-chart">
        <h2>3rd Down Performance Leaders</h2>
        <AlertMessage
          tone="info"
          message="No quarterbacks are available for the third down chart with the current filters."
        />
      </section>
    );
  }

  const leaders = [...records]
    .sort(
      (a, b) =>
        toPercentage(b.third_down_regular_conversion_rate) -
        toPercentage(a.third_down_regular_conversion_rate)
    )
    .slice(0, topN)
    .map((record) => ({
      name: record.player_display_name ?? "Unknown",
      team: record.team ?? "—",
      dropbacks: record.total_dropbacks ?? 0,
      regularRate: toPercentage(record.third_down_regular_conversion_rate),
      longRate: toPercentage(record.third_and_long_conversion_rate),
    }));

  const chartHeight = PLOT_TOP + leaders.length * ROW_HEIGHT + PLOT_BOTTOM;
  const plotWidth = CHART_WIDTH - PLOT_LEFT - PLOT_RIGHT;

  return (
    <section className="advanced-chart">
      <h2>3rd Down Performance Leaders</h2>
      <p>
        Top {leaders.length} qualified quarterbacks by regular third down
        conversion rate.
      </p>

      <div className="qb-score-chart__legend">
        <span className="qb-score-chart__legend-item">
          <span
            className="qb-score-chart__swatch"
            style={{ backgroundColor: "#9bd1ff" }}
          />
          Regular 3rd Down
        </span>
        <span className="qb-score-chart__legend-item">
          <span
            className="qb-score-chart__swatch"
            style={{ backgroundColor: "#0b3d91" }}
          />
          3rd & Long
        </span>
      </div>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${chartHeight}`}
        role="img"
        aria-label="Third down performance leaders chart"
      >
        {[0, 25, 50, 75, 100].map((tick) => {
          const x = PLOT_LEFT + (tick / 100) * plotWidth;

          return (
            <g key={tick}>
              <line
                x1={x}
                x2={x}
                y1={PLOT_TOP - 8}
                y2={chartHeight - PLOT_BOTTOM}
                stroke="rgba(255,255,255,0.16)"
              />
              <text x={x} y={chartHeight - 16} textAnchor="middle">
                {tick}
              </text>
            </g>
          );
        })}

        {leaders.map((leader, index) => {
          const y = PLOT_TOP + index * ROW_HEIGHT;
          const regularWidth = (leader.regularRate / 100) * plotWidth;
          const longWidth = (leader.longRate / 100) * plotWidth;

          return (
            <g key={`${leader.name}-${leader.team}`}>
              <text x={PLOT_LEFT - 12} y={y + 24} textAnchor="end">
                {leader.name}
              </text>
              <rect
                x={PLOT_LEFT}
                y={y + 4}
                width={regularWidth}
                height="26"
                rx="6"
                fill="#9bd1ff"
                stroke="white"
                strokeWidth="1"
              />
              <rect
                x={PLOT_LEFT}
                y={y + 9}
                width={longWidth}
                height="16"
                rx="5"
                fill="#0b3d91"
                stroke="white"
                strokeWidth="1"
              />
              <text x={PLOT_LEFT + regularWidth + 8} y={y + 24}>
                {formatPercentage(leader.regularRate)}
              </text>
              <title>
                {`${leader.name} (${leader.team}) — Regular 3rd Down: ${formatPercentage(
                  leader.regularRate
                )}, 3rd & Long: ${formatPercentage(
                  leader.longRate
                )}, Dropbacks: ${formatNumber(leader.dropbacks)}`}
              </title>
            </g>
          );
        })}

        <text x={PLOT_LEFT + plotWidth / 2} y={chartHeight - 2} textAnchor="middle">
          Conversion Rate (%)
        </text>
      </svg>
    </section>
  );
}

export default ThirdDownPerformanceChart;
