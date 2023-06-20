export function parseAlphaValue(str: string) {
  return str ? Math.max(0, Math.min(1, parseFloat(str))) : undefined;
}
