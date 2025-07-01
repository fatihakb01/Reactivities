import { format, type DateArg } from "date-fns";

// Util function that formats the date properly
export function formatDate(date: DateArg<Date>) {
    return format(date, 'dd MMM yyyy h:mm a')
}