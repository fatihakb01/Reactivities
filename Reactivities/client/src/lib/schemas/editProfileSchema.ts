 import {z} from "zod";
 import {requiredString} from "../util/util.ts";

 /**
 * Zod schema for validating profile edit form input.
 *
 * Rules:
 * - `displayName` is required and must be a non-empty string.
 * - `bio` is optional.
 */
 export const editProfileSchema = z.object({
    displayName: requiredString('Display Name'),
    bio: z.string().optional()
 });

 /**
 * TypeScript type inferred from {@link editProfileSchema}.
 *
 * @typedef {Object} EditProfileSchema
 * @property {string} displayName - The user's display name (required).
 * @property {string} [bio] - The user's biography or description (optional).
 */
 export type EditProfileSchema = z.infer<typeof editProfileSchema>;
 