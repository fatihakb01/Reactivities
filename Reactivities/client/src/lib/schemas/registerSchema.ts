import z from "zod";
import { requiredString } from "../util/util";

/**
 * registerSchema
 * ---------------
 * Zod schema for validating registration form data.
 *
 * Fields:
 * - `email`: Must be a valid email address.
 * - `displayName`: Required string, minimum length of 2 characters, maximum length of 15 characters.
 * - `password`: Required string (validated by `requiredString` utility).
 *
 * Usage:
 * - Used with `react-hook-form` and `zodResolver` to validate registration input.
 */
export const registerSchema = z.object({
    email: z.email(),
    displayName: requiredString('displayName').min(2).max(15),
    password: requiredString('password'),
})

export type RegisterSchema = z.infer<typeof registerSchema>
