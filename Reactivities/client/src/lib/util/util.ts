import { format, formatDistanceToNow, type DateArg } from "date-fns";
import z from "zod";

/**
 * Formats a date to `dd MMM yyyy h:mm a` format.
 *
 * @param date - The date to format.
 * @returns The formatted date string.
 *
 * @example
 * formatDate(new Date()); // "09 Aug 2025 3:45 pm"
 */
export function formatDate(date: DateArg<Date>) {
    return format(date, 'dd MMM yyyy h:mm a')
}

/**
 * Returns a human-readable "time ago" string for the given date.
 *
 * @param date - The date to compare to the current time.
 * @returns A relative time string ending with "ago".
 *
 * @example
 * timeAgo(new Date(Date.now() - 60000)); // "1 minute ago"
 */
export function timeAgo(date: DateArg<Date>) {
    return formatDistanceToNow(date) + ' ago'
}

/**
 * Creates a Zod string schema that is required, with a custom error message.
 *
 * @param fieldName - The field name to include in the validation error message.
 * @returns A Zod string schema.
 *
 * @example
 * const schema = z.object({
 *   name: requiredString('Name')
 * });
 */
export const requiredString = (fieldName: string) => z
    .string('')
    .min(1, {message: `${fieldName} is required`})
