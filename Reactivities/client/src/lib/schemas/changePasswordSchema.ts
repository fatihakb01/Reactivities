import z from "zod";
import { requiredString } from "../util/util";

/**
 * Defines the Zod schema and type for changing a user's password.
 *
 * This schema is used to validate the form data when a logged-in user wants to
 * change their password, ensuring all required fields are present and the
 * new password is confirmed correctly.
 *
 * Features:
 * - Uses Zod for schema validation.
 * - Requires `currentPassword`, `newPassword`, and `confirmPassword`.
 * - Refines the schema to add a custom validation rule: the new password and
 * its confirmation must be identical.
 *
 * Example usage:
 * ```typescript
 * import { changePasswordSchema, type ChangePasswordSchema } from './changePasswordSchema';
 * import { zodResolver } from '@hookform/resolvers/zod';
 *
 * const resolver = zodResolver(changePasswordSchema);
 * ```
 */
export const changePasswordSchema = z.object({
    currentPassword: requiredString('currentPassword'),
    newPassword: requiredString('newPassword'),
    confirmPassword: requiredString('confirmPassword')
})
.refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
})

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
