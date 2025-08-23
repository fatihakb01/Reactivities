import { changePasswordSchema, type ChangePasswordSchema } from '../../lib/schemas/changePasswordSchema'
import AccountFormWrapper from './AccountFormWrapper';
import { Password } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from '../../app/shared/components/TextInput';
import { useAccount } from '../../lib/hooks/useAccount';
import { toast } from 'react-toastify';

/**
 * The form for changing a user's password.
 *
 * Features:
 * - Uses `AccountFormWrapper` for consistent layout and form handling.
 * - Uses Zod (`changePasswordSchema`) for validation via `zodResolver`.
 * - Calls the `useAccount().changePassword` mutation on submit.
 * - Displays a success toast notification on successful password change.
 *
 * Form Fields:
 * - Current password
 * - New password
 * - Confirm new password
 *
 * Example usage:
 * ```tsx
 * <ChangePasswordForm />
 * ```
 */
export default function ChangePasswordForm() {
    const {changePassword} = useAccount()
    const onSubmit = async (data: ChangePasswordSchema) => {
        try {
            await changePassword.mutateAsync(data, {
                onSuccess: () => toast.success('Your password has been changed')
            });
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AccountFormWrapper<ChangePasswordSchema>
            title='Change Password'
            icon={<Password fontSize="large"/>}    
            onSubmit={onSubmit}
            submitButtonText="Update password"
            resolver={zodResolver(changePasswordSchema)}
            reset={true}
        >
            <TextInput type="password" label="Current password" name="currentPassword"/>
            <TextInput type="password" label="New password" name="newPassword"/>
            <TextInput type="password" label="Confirm password" name="confirmPassword"/>
        </AccountFormWrapper>
    )
}
