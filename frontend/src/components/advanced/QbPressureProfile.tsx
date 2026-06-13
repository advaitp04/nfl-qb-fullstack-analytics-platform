import { useEffect, useState } from "react";
import QbSelect from "../comparison/QbSelect";
import AlertMessage from "../ui/AlertMessage";
import type { AdvancedMetricsRecord } from "../../types/api";
import { formatPercentile } from "../../utils/metricFormatters";

type Props = {
  records: AdvancedMetricsRecord[];
};

type TraitKey =
  | "turnover_score"
  | "drive_score"
  | "success_score"
  | "negative_epa_rate"
  | "panic_play_rate"
  | "third_down_conversion_rate"
  | "third_and_long_conversion_rate"
  | "third_down_regular_conversion_rate"
  | "redzone_td_rate";

type TraitConfig = {
  label: string;
  key: TraitKey;
  invert?: boolean;
};

type ProfileRow = {
  trait: string;
  percentile: number;
};

const CHART_WIDTH = 720;
const ROW_HEIGHT = 34;
const PLOT_TOP = 28;
const PLOT_RIGHT = 40;
const PLOT_BOTTOM = 44;
const PLOT_LEFT = 230;

const TRAITS: TraitConfig[] = [
  { label: "Ball Security", key: "turnover_score" },
  { label: "Drive Sustainability", key: "drive_score" },
  { label: "Play Success", key: "success_score" },
  {
    label: "Down-to-Down Sustainability",
    key: "negative_epa_rate",
    invert: true,
  },
  { label: "Pressure Composure", key: "panic_play_rate", invert: true },
  { label: "Third Down Execution", key: "third_down_conversion_rate" },
  { label: "Third and Long Execution", key: "third_and_long_conversion_rate" },
  {
    label: "Standard Third Down Execution",
    key: "third_down_regular_conversion_rate",
  },
  { label: "Red Zone Finishing", key: "redzone_td_rate" },
];

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

function getTraitValue(record: AdvancedMetricsRecord, trait: TraitConfig) {
  const value = record[trait.key] ?? 0;
  return trait.invert ? 1 - value : value;
}

function calculatePercentile(value: number, values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const belowOrEqual = values.filter((candidate) => candidate <= value).length;
  return Math.round((belowOrEqual / values.length) * 100);
}

function buildProfileRows(
  records: AdvancedMetricsRecord[],
  selectedRecord: AdvancedMetricsRecord
): ProfileRow[] {
  return TRAITS.map((trait) => {
    const values = records.map((record) => getTraitValue(record, trait));
    const value = getTraitValue(selectedRecord, trait);

    return {
      trait: trait.label,
      percentile: calculatePercentile(value, values),
    };
  }).sort((a, b) => b.percentile - a.percentile);
}

function describeProfile(rows: ProfileRow[]): string {
  const strengths = rows.slice(0, 2).map((row) => row.trait.toLowerCase());
  const weakness = rows[rows.length - 1]?.trait.toLowerCase() ?? "overall profile";

  return `Strongest in ${strengths.join(
    " and "
  )}, with the most room to improve in ${weakness}.`;
}

function QbPressureProfile({ records }: Props) {
  const qbNames = getUniqueQbNames(records);
  const [selectedQb, setSelectedQb] = useState("");

  useEffect(() => {
    if (qbNames.length === 0) {
      setSelectedQb("");
      return;
    }

    setSelectedQb((current) =>
      current && qbNames.includes(current) ? current : qbNames[0]
    );
  }, [qbNames]);

  if (records.length === 0 || qbNames.length === 0) {
    return (
      <section className="advanced-chart">
        <h2>QB Pressure Profile</h2>
        <AlertMessage
          tone="info"
          message="No quarterbacks are available for the pressure profile with the current filters."
        />
      </section>
    );
  }

  const selectedRecord = findRecordByName(records, selectedQb);

  if (!selectedRecord) {
    return (
      <section className="advanced-chart">
        <h2>QB Pressure Profile</h2>
        <AlertMessage
          tone="info"
          message="Choose a quarterback to view a pressure profile."
        />
      </section>
    );
  }

  const rows = buildProfileRows(records, selectedRecord);
  const chartHeight = PLOT_TOP + rows.length * ROW_HEIGHT + PLOT_BOTTOM;
  const plotWidth = CHART_WIDTH - PLOT_LEFT - PLOT_RIGHT;

  return (
    <section className="advanced-chart">
      <h2>QB Pressure Profile</h2>
      <QbSelect
        label="Select QB for pressure profile"
        qbNames={qbNames}
        selectedQb={selectedQb}
        onChange={setSelectedQb}
      />

      <h3>
        {selectedRecord.player_display_name ?? "Unknown"} (
        {selectedRecord.team ?? "—"})
      </h3>
      <p>{describeProfile(rows)}</p>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${chartHeight}`}
        role="img"
        aria-label={`Pressure profile for ${selectedRecord.player_display_name}`}
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

        {rows.map((row, index) => {
          const y = PLOT_TOP + index * ROW_HEIGHT;
          const barWidth = (row.percentile / 100) * plotWidth;
          const lightness = 82 - row.percentile * 0.38;

          return (
            <g key={row.trait}>
              <text x={PLOT_LEFT - 12} y={y + 21} textAnchor="end">
                {row.trait}
              </text>
              <rect
                x={PLOT_LEFT}
                y={y + 5}
                width={barWidth}
                height="22"
                rx="6"
                fill={`hsl(210, 76%, ${lightness}%)`}
              />
              <text x={PLOT_LEFT + barWidth + 8} y={y + 21}>
                {formatPercentile(row.percentile)}
              </text>
              <title>
                {`${row.trait}: ${formatPercentile(row.percentile, true)}`}
              </title>
            </g>
          );
        })}

        <text x={PLOT_LEFT + plotWidth / 2} y={chartHeight - 2} textAnchor="middle">
          Percentile Rank Among Filtered QBs
        </text>
      </svg>
    </section>
  );
}

export default QbPressureProfile;
