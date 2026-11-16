export function hex(
  value: number,
  width: number,
  { lower = false, fill = '0' }: { lower?: boolean; fill?: string } = {},
): string {
  const digits = value.toString(16).padStart(width, fill)
  return lower ? digits : digits.toUpperCase()
}
