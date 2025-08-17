import {z} from 'zod';
import { requiredString } from '../util/util';

/**
 * activitySchema
 * ---------------
 * A Zod schema used to validate `Activity` objects throughout the application.
 * 
 * Purpose:
 * - Ensures that all required fields for an activity are present and valid.
 * - Provides runtime validation and strong TypeScript inference when creating or updating activities.
 * 
 * Fields:
 * - `id` (string, readonly): A unique identifier for the activity. Marked as readonly to prevent editing.
 * - `isCancelled` (boolean, readonly): Indicates whether the activity has been cancelled. Also readonly.
 * - `title` (string): The title of the activity. Required.
 * - `description` (string): A detailed description of the activity. Required.
 * - `category` (string): The category under which the activity falls (e.g., music, sports). Required.
 * - `date` (Date): The scheduled date of the activity. Required and coerced from input.
 * - `location` (object): Nested object containing:
 *    • `venue` (string): Name of the venue. Required.  
 *    • `city` (string): City where the activity takes place. Required.  
 *    • `latitude` (number): Latitude coordinate of the venue.  
 *    • `longitude` (number): Longitude coordinate of the venue.
 * 
 * Notes:
 * - `z.coerce` is used on certain fields (like `date` and numeric fields) so that values like strings
 *   from form inputs are automatically converted to the correct types.
 * - `requiredString` is a utility wrapper that enforces non-empty strings with custom error messages.
 * - The schema is commonly used with `react-hook-form` and `zodResolver` for validating form data.
 * 
 * Related Type:
 * - `ActivitySchema`: An inferred TypeScript type from this schema for compile-time type safety.
 */
export const activitySchema = z.object({
    id: z.coerce.string<string>({
        message: 'id is readonly'
    }).readonly(),

    isCancelled: z.coerce.boolean<boolean>({
        message: 'isCancelled is readonly'
    }).readonly(),

    title: requiredString('Title'),
    description: requiredString('Description'),
    category: requiredString('Category'),

    date: z.coerce.date<Date>({
        message: 'Date is required'
    }), 

    location: z.object({
        venue: requiredString('Venue'),
        city: requiredString('City'),
        latitude: z.coerce.number<number>(),
        longitude: z.coerce.number<number>()
    })
})

/** 
 * Inferred TypeScript type for activities based on `activitySchema`.
 * Use this for type safety when working with activity objects.
 */
export type ActivitySchema = z.infer<typeof activitySchema>