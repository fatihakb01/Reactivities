import { useAccount } from '../../lib/hooks/useAccount'
import type { FieldValues } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import AccountFormWrapper from './AccountFormWrapper';
import { LockOpen } from '@mui/icons-material';
import TextInput from '../../app/shared/components/TextInput';

/**
 * The form for requesting a password reset email.
 *
 * Features:
 * - Uses `AccountFormWrapper` for consistent layout and form handling.
 * - Calls the `useAccount().forgotPassword` mutation on submit.
 * - Navigates to the login page after a successful request.
 * - Displays a success toast notification.
 *
 * Form Fields:
 * - Email address
 *
 * Example usage:
 * ```tsx
 * <ForgotPasswordForm />
 * ```
 */
export default function ForgotPasswordForm() {
    const {forgotPassword} = useAccount();
    const navigate = useNavigate();

    const onSubmit = async (data: FieldValues) => {
        try {
            await forgotPassword.mutateAsync(data.email, {
                onSuccess: () => {
                    toast.success('Password reset requested - please check your email')
                    navigate('/login')
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AccountFormWrapper
            title='Please enter your email address'
            icon={<LockOpen fontSize="large"/>}
            submitButtonText="Request password reset link"
            onSubmit={onSubmit}
        >
            <TextInput rules={{required: true}} label='Email address' name='email'/>
        </AccountFormWrapper>
    )
}
