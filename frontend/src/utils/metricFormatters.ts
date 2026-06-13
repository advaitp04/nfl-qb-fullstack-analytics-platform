export function toPercentage(
  value: number | null | undefined
): number {
  return (value ?? 0) * 100;
}