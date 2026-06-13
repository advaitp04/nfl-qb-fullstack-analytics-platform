import type { AdvancedMetricsRecord } from "../../types/api";

type Props = {
  records: AdvancedMetricsRecord[];
};

const CHART_WIDTH = 720;
const CHART_HEIGHT = 460;
const PLOT_TOP = 48;
const PLOT_RIGHT = 124;
const PLOT_BOTTOM = 72;
const PLOT_LEFT = 72;
const PLOT_WIDTH = CHART_WIDTH - PLOT_LEFT - PLOT_RIGHT;
const PLOT_HEIGHT = CHART_HEIGHT - PLOT_TOP - PLOT_BOTTOM;

function getRate(value: number | null | undefined): number {
  return (value ?? 0) * 100;
}

function scale(value: number, min: number, max: number): number {
  if (max === min) {
    return 0.5;
  }

  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function getDomain(values: number[]): [number, number] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min || 1) * 0.16;

  return [Math.max(0, min - padding), max + padding];
}

function getPointColor(score: number, min: number, max: number): string {
  const normalized = scale(score, min, max);
  const hue = 260 - normalized * 115;
  const lightness = 58 - normalized * 18;

  return `hsl(${hue}, 78%, ${lightness}%)`;
}

function VolatilityEfficiencyChart({ records }: Props) {
  const points = records.map((record) => ({
    name: record.player_display_name ?? "Unknown",
    team: record.team ?? "—",
    negativeEpaRate: getRate(record.negative_epa_rate),
    panicPlayRate: getRate(record.panic_play_rate),
    stabilizedCortisolRating: getRate(record.adjusted_cortisol_score),
  }));

  const [minX, maxX] = getDomain(
    points.map((point) => point.negativeEpaRate)
  );
  const [minY, maxY] = getDomain(points.map((point) => point.panicPlayRate));
  const minScore = Math.min(
    ...points.map((point) => point.stabilizedCortisolRating)
  );
  const maxScore = Math.max(
    ...points.map((point) => point.stabilizedCortisolRating)
  );
  const meanX =
    points.reduce((total, point) => total + point.negativeEpaRate, 0) /
    points.length;
  const meanY =
    points.reduce((total, point) => total + point.panicPlayRate, 0) /
    points.length;

  const getX = (value: number) =>
    PLOT_LEFT + scale(value, minX, maxX) * PLOT_WIDTH;
  const getY = (value: number) =>
    PLOT_TOP + (1 - scale(value, minY, maxY)) * PLOT_HEIGHT;

  return (
    <section className="advanced-chart">
      <h2>QB Volatility vs. Efficiency</h2>
      <p>
        Negative EPA rate shows down-to-down instability. Panic play rate shows
        high-pressure negative plays.
      </p>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        role="img"
        aria-label="QB volatility versus efficiency scatter plot"
      >
        <defs>
          <linearGradient
            id="stabilized-cortisol-rating-gradient"
            x1="0"
            x2="0"
            y1="1"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor={getPointColor(minScore, minScore, maxScore)}
            />
            <stop
              offset="100%"
              stopColor={getPointColor(maxScore, minScore, maxScore)}
            />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
          const xValue = minX + tick * (maxX - minX);
          const yValue = minY + tick * (maxY - minY);
          const x = getX(xValue);
          const y = getY(yValue);

          return (
            <g key={tick}>
              <line
                x1={x}
                x2={x}
                y1={PLOT_TOP}
                y2={CHART_HEIGHT - PLOT_BOTTOM}
                stroke="rgba(255,255,255,0.18)"
              />
              <line
                x1={PLOT_LEFT}
                x2={CHART_WIDTH - PLOT_RIGHT}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.18)"
              />
              <text x={x} y={CHART_HEIGHT - PLOT_BOTTOM + 22} textAnchor="middle">
                {xValue.toFixed(1)}
              </text>
              <text x={PLOT_LEFT - 14} y={y + 4} textAnchor="end">
                {yValue.toFixed(1)}
              </text>
            </g>
          );
        })}

        <line
          x1={getX(meanX)}
          x2={getX(meanX)}
          y1={PLOT_TOP}
          y2={CHART_HEIGHT - PLOT_BOTTOM}
          stroke="rgba(255,255,255,0.55)"
          strokeDasharray="6 6"
        />
        <text x={getX(meanX) + 6} y={PLOT_TOP + 14}>
          Avg Negative EPA
        </text>
        <line
          x1={PLOT_LEFT}
          x2={CHART_WIDTH - PLOT_RIGHT}
          y1={getY(meanY)}
          y2={getY(meanY)}
          stroke="rgba(255,255,255,0.55)"
          strokeDasharray="6 6"
        />
        <text x={PLOT_LEFT + 8} y={getY(meanY) - 8}>
          Avg Panic Play
        </text>

        {points.map((point) => {
          const radius =
            6 + scale(point.stabilizedCortisolRating, minScore, maxScore) * 10;

          return (
            <circle
              key={`${point.name}-${point.team}`}
              cx={getX(point.negativeEpaRate)}
              cy={getY(point.panicPlayRate)}
              r={radius}
              fill={getPointColor(
                point.stabilizedCortisolRating,
                minScore,
                maxScore
              )}
              stroke="white"
              strokeWidth="1.5"
              opacity="0.88"
            >
              <title>
                {`Player: ${point.name}
Team: ${point.team}
Negative EPA Rate: ${point.negativeEpaRate.toFixed(
                  1
                )}%
Panic Play Rate: ${point.panicPlayRate.toFixed(
                  1
                )}%
Stabilized Cortisol Rating: ${point.stabilizedCortisolRating.toFixed(
                  1
                )}`}
              </title>
            </circle>
          );
        })}

        <g>
          <text x={CHART_WIDTH - 84} y={PLOT_TOP} textAnchor="middle">
            Stabilized
          </text>
          <text x={CHART_WIDTH - 84} y={PLOT_TOP + 16} textAnchor="middle">
            Cortisol Rating
          </text>
          <rect
            x={CHART_WIDTH - 94}
            y={PLOT_TOP + 34}
            width="20"
            height="180"
            rx="6"
            fill="url(#stabilized-cortisol-rating-gradient)"
            stroke="rgba(255,255,255,0.65)"
          />
          <text x={CHART_WIDTH - 66} y={PLOT_TOP + 42}>
            {maxScore.toFixed(1)}
          </text>
          <text x={CHART_WIDTH - 66} y={PLOT_TOP + 214}>
            {minScore.toFixed(1)}
          </text>
        </g>

        <text x={CHART_WIDTH / 2} y={CHART_HEIGHT - 20} textAnchor="middle">
          Negative EPA Rate (%)
        </text>
        <text
          x="20"
          y={CHART_HEIGHT / 2}
          textAnchor="middle"
          transform={`rotate(-90 20 ${CHART_HEIGHT / 2})`}
        >
          Panic Play Rate (%)
        </text>
      </svg>
    </section>
  );
}

export default VolatilityEfficiencyChart;
