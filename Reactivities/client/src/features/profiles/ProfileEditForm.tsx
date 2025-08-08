import { useForm } from "react-hook-form";
 import { editProfileSchema, type EditProfileSchema } from "../../lib/schemas/editProfileSchema"
 import { zodResolver } from "@hookform/resolvers/zod";
 import { useProfile } from "../../lib/hooks/useProfile.ts";
 import { useEffect } from "react";
 import { Box, Button } from "@mui/material";
 import TextInput from "../../app/shared/components/TextInput.tsx";
 import { useParams } from "react-router";

 type Props = {
    setEditMode: (editMode: boolean) => void;
 }
 
 /**
 * ProfileEdit component for editing a user's profile.
 *
 * Features:
 * - Displays form inputs for `displayName` and `bio`.
 * - Uses `react-hook-form` with `zod` validation.
 * - Prefills form values from the current profile.
 * - Calls `updateProfile` mutation from {@link useProfile} on submit.
 * - Disables submit button when form is invalid, pristine, or request is pending.
 *
 * @component
 * @param {Object} props
 * @param {(editMode: boolean) => void} props.setEditMode - Callback to toggle edit mode after submission.
 *
 * @example
 * <ProfileEdit setEditMode={setEditMode} />
 */
 export default function ProfileEdit({ setEditMode }: Props) {
    const { id } = useParams();
    const { updateProfile, profile } = useProfile(id);
    const { control, handleSubmit, reset, formState: { isDirty, isValid } } = useForm<EditProfileSchema>({
        resolver: zodResolver(editProfileSchema),
        mode: 'onTouched'
    });

    const onSubmit = (data: EditProfileSchema) => {
        updateProfile.mutate(data, {
            onSuccess: () => setEditMode(false)
        });
    }

    useEffect(() => {
        reset({
            displayName: profile?.displayName,
            bio: profile?.bio || ''
        });
    }, [profile, reset]);

    return (
        <Box component='form'
            onSubmit={handleSubmit(onSubmit)}
            display='flex'
            flexDirection='column'
            alignContent='center'
            gap={3}
            mt={3}
        >
            <TextInput label='Display Name' name='displayName' control={control} />
            <TextInput
                label='Add your bio'
                name='bio'
                control={control}
                multiline
                rows={10}
            />
            <Button
                type='submit'
                variant='contained'
                disabled={!isValid || !isDirty || updateProfile.isPending}
            >
                Update profile
            </Button>
        </Box>
    );
 }
