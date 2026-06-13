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
const ROW_HEIGHT = 34;
const PLOT_TOP = 28;
const PLOT_RIGHT = 32;
const PLOT_BOTTOM = 44;
const PLOT_LEFT = 190;

function RedzoneTdLeadersChart({ records, topN }: Props) {
  if (records.length === 0) {
    return (
      <section className="advanced-chart">
        <h2>Red Zone Passing TD Leaders</h2>
        <AlertMessage
          tone="info"
          message="No quarterbacks are available for the red zone leaders chart with the current filters."
        />
      </section>
    );
  }

  const leaders = [...records]
    .sort((a, b) => toPercentage(b.redzone_td_rate) - toPercentage(a.redzone_td_rate))
    .slice(0, topN)
    .map((record) => ({
      name: record.player_display_name ?? "Unknown",
      team: record.team ?? "—",
      dropbacks: record.total_dropbacks ?? 0,
      rate: toPercentage(record.redzone_td_rate),
    }));

  const chartHeight = PLOT_TOP + leaders.length * ROW_HEIGHT + PLOT_BOTTOM;
  const plotWidth = CHART_WIDTH - PLOT_LEFT - PLOT_RIGHT;
  const maxRate = Math.max(...leaders.map((leader) => leader.rate), 1);

  return (
    <section className="advanced-chart">
      <h2>Red Zone Passing TD Leaders</h2>
      <p>Top {leaders.length} qualified quarterbacks by redzone passing TD rate.</p>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${chartHeight}`}
        role="img"
        aria-label="Red zone passing touchdown leaders chart"
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
          const barWidth = (leader.rate / maxRate) * plotWidth;

          return (
            <g key={`${leader.name}-${leader.team}`}>
              <text x={PLOT_LEFT - 12} y={y + 21} textAnchor="end">
                {leader.name}
              </text>
              <rect
                x={PLOT_LEFT}
                y={y + 5}
                width={barWidth}
                height="22"
                rx="6"
                fill="#0b3d91"
                stroke="white"
                strokeWidth="1"
              />
              <text x={PLOT_LEFT + barWidth + 8} y={y + 21}>
                {formatPercentage(leader.rate)}
              </text>
              <title>
                {`${leader.name} (${leader.team}) — Redzone TD Rate: ${formatPercentage(
                  leader.rate
                )}, Dropbacks: ${formatNumber(leader.dropbacks)}`}
              </title>
            </g>
          );
        })}

        <text x={PLOT_LEFT + plotWidth / 2} y={chartHeight - 2} textAnchor="middle">
          Redzone Passing TD Rate (%)
        </text>
      </svg>
    </section>
  );
}

export default RedzoneTdLeadersChart;
