export function toPercentage(
  value: number | null | undefined
): number {
  return (value ?? 0) * 100;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString();
}

export function formatPercentile(value: number, includeLabel = false): string {
  const rounded = Math.round(value);
  const remainder = rounded % 100;
  const suffix =
    remainder >= 11 && remainder <= 13
      ? "th"
      : rounded % 10 === 1
        ? "st"
        : rounded % 10 === 2
          ? "nd"
          : rounded % 10 === 3
            ? "rd"
            : "th";
  const percentile = `${rounded}${suffix}`;

  return includeLabel ? `${percentile} percentile` : percentile;
}
