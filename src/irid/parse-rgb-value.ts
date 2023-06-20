export function parseRGBValue(str: string): number {
  const percent = str.charAt(str.length - 1) === "%";
  if (percent) {
    str = str.slice(0, str.length - 1);
  }
  return Math.max(
    0,
    Math.min(255, Math.round(parseInt(str, 10) * (percent ? 2.55 : 1))),
  );
}
