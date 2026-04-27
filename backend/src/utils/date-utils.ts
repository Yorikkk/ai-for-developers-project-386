/**
 * Extracts date in YYYY-MM-DD format from ISO date-time string
 */
export function extractDate(dateTime: string): string {
  return dateTime.split('T')[0];
}

/**
 * Validates ISO 8601 date-time format
 */
export function isValidDateTime(dateTime: string): boolean {
  const date = new Date(dateTime);
  return !isNaN(date.getTime());
}

/**
 * Validates date format YYYY-MM-DD
 */
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}
