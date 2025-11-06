export function estimateSlack(length: number): number {
  if (length <= 0) return 0;
  if (length < 5) return 0.5;
  if (length < 20) return length * 0.05;
  return Math.min(length * 0.1, 5);
}
