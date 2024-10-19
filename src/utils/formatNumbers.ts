export function formatNumbers(number: number | string): string {
  const num = typeof number === "string" ? parseInt(number, 10) : number;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  })
    .format(num)
    .replace(/,/g, " "); // Replace commas with spaces
}
