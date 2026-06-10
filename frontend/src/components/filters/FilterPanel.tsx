import {
  AVAILABLE_SEASONS,
  SEASON_TYPE_LABELS,
} from "../../constants/filters";
import type { SeasonType } from "../../types/api";

type Props = {
  season: number;
  onSeasonChange: (season: number) => void;
  seasonType: SeasonType;
  onSeasonTypeChange: (seasonType: SeasonType) => void;
  minDropbacks: number;
  onMinDropbacksChange: (value: number) => void;
  maxDropbacks: number;
  dropbackMin: number;
  dropbackStep: number;
};

function FilterPanel({
  season,
  onSeasonChange,
  seasonType,
  onSeasonTypeChange,
  minDropbacks,
  onMinDropbacksChange,
  maxDropbacks,
  dropbackMin,
  dropbackStep,
}: Props) {
  return (
    <section className="filter-panel">
      <h2 className="filter-panel__title">Filters</h2>

      <label className="filter-field">
        <span>Season</span>
        <select
          value={season}
          onChange={(event) => onSeasonChange(Number(event.target.value))}
        >
          {AVAILABLE_SEASONS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Season Type</span>
        <select
          value={seasonType}
          onChange={(event) =>
            onSeasonTypeChange(event.target.value as SeasonType)
          }
        >
          {(Object.keys(SEASON_TYPE_LABELS) as SeasonType[]).map((value) => (
            <option key={value} value={value}>
              {SEASON_TYPE_LABELS[value]}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field filter-field--slider">
        <span>Minimum Dropbacks: {minDropbacks}</span>
        <input
          type="range"
          min={dropbackMin}
          max={maxDropbacks}
          step={dropbackStep}
          value={Math.min(minDropbacks, maxDropbacks)}
          onChange={(event) =>
            onMinDropbacksChange(Number(event.target.value))
          }
        />
      </label>
    </section>
  );
}

export default FilterPanel;
