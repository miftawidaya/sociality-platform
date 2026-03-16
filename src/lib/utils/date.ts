import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Returns a relative time string (e.g., "1 minute ago", "1 week ago").
 * Useful for post timestamps, comment dates, etc.
 *
 * @param dateString - The ISO date string or Date object to format
 * @returns Formatted relative time string
 */
export function getRelativeTime(dateString: string | Date): string {
  return dayjs(dateString).fromNow();
}
