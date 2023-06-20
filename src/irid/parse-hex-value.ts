export default function parseHexValue(str: string): number {
  if (str.length === 1) {
    str += str;
  }
  return Math.max(0, Math.min(255, parseInt(str, 16)));
}
