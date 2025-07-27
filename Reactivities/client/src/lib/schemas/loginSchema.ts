import z from "zod";

/**
 * loginSchema
 * -----------
 * Zod schema for validating login form data.
 *
 * Fields:
 * - `email`: Must be a valid email address.
 * - `password`: Must be a string with at least 6 characters.
 *
 * Usage:
 * - Used with `react-hook-form` and `zodResolver` to validate login input.
 */
export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export type LoginSchema = z.infer<typeof loginSchema>;
