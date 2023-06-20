export function parseHueValue(str: string): number {
  let val = parseInt(str, 10) % 360;
  if (val < 0) {
    val += 360;
  }
  return val / 360;
}
