export function parseSLValue(str: string): number {
  return Math.max(0, Math.min(100, parseInt(str, 10))) / 100;
}
