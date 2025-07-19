import {z} from 'zod';

/**
 * Helper to create a required string with a custom field name in the error message.
 * @param fieldName - The name of the field to show in validation errors.
 */
const requiredString = (fieldName: string) => z
    .string()
    .min(1, {message: `${fieldName} is required`})

/**
 * Zod schema that validates an `Activity` object.
 * This ensures fields like title, description, category, date, and location are present and valid.
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
    }),
})

/** 
 * Inferred TypeScript type for activities based on `activitySchema`.
 * Use this for type safety when working with activity objects.
 */
export type ActivitySchema = z.infer<typeof activitySchema>