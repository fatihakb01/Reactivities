import { format, type DateArg } from "date-fns";
import z from "zod";

// Util function that formats the date properly
export function formatDate(date: DateArg<Date>) {
    return format(date, 'dd MMM yyyy h:mm a')
}

/**
 * Helper to create a required string with a custom field name in the error message.
 * @param fieldName - The name of the field to show in validation errors.
 */
export const requiredString = (fieldName: string) => z
    .string()
    .min(1, {message: `${fieldName} is required`})
