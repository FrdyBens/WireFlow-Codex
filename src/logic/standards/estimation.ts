export const estimateSlack = (length: number) => {
  if (length <= 0) return 0;
  return Math.max(0.3 * length, 1.5);
};
