import z from "zod";
import { requiredString } from "../util/util";

/**
 * Defines the Zod schema and type for resetting a user's password.
 *
 * This schema ensures that the form data for a password reset is valid,
 * specifically by checking that the new password and its confirmation match.
 *
 * Features:
 * - Uses Zod for schema validation.
 * - Enforces that `newPassword` and `confirmPassword` are required strings.
 * - Refines the schema to add a custom validation rule: the two password fields must be identical.
 *
 * Example usage:
 * ```typescript
 * import { resetPasswordSchema, type ResetPasswordSchema } from './resetPasswordSchema';
 * import { zodResolver } from '@hookform/resolvers/zod';
 *
 * const resolver = zodResolver(resetPasswordSchema);
 * ```
 */
export const resetPasswordSchema = z.object({
    newPassword: requiredString('newPassword'),
    confirmPassword: requiredString('confirmPassword')
})
.refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
