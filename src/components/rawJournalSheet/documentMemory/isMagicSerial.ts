/**
 * Given a period and depth, returns whether the serial number is one where we
 * will trigger a push to the next stack.
 */
export function isMagicSerial(period: number, depth: number, serial: number) {
  // we could cache this in some way (like making isMagicSerial f -> f -> bool)
  // which would help with the speed of tests, but isn't necessary in actual use
  // and just adds complexity
  let offset = Math.pow(period, depth);
  for (let i = depth - 1; i > 0; i--) {
    offset += Math.pow(period, i);
  }
  const isMagicSerial =
    serial > offset && (serial - offset) % period ** depth === 0;
  return isMagicSerial;
}
