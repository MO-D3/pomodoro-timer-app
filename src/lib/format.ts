/**
 * Helper to pad a number with leading zeroes to length 2.
 */
export function pad2(num: number): string {
  return num.toString().padStart(2, '0');
}
