const FILL_FACTOR = 0.4; // 40% fill limit per IEC 61586

export const sizeConduitForCableBundle = (cableCount: number, cableDiameterMm: number) => {
  const totalArea = cableCount * Math.PI * (cableDiameterMm / 2) ** 2;
  const requiredArea = totalArea / FILL_FACTOR;
  const diameter = Math.sqrt((requiredArea / Math.PI) * 4);
  // Round up to nearest standard size
  const standardSizes = [16, 20, 25, 32, 40, 50];
  return standardSizes.find((size) => size >= diameter) ?? standardSizes[standardSizes.length - 1];
};
