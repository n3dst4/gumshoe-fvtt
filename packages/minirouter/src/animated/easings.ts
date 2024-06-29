// https://easings.net
export function easeInQuart(x: number): number {
  return x * x * x * x;
}
export function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

export function easeInCubic(x: number): number {
  return x * x * x;
}

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}
