import { Button, Paper, Typography } from "@mui/material";
import { useAccount } from "../../lib/hooks/useAccount";
import { Check } from "@mui/icons-material";

type Props = {
    email?: string;
}

/**
 * A component to display after a successful user registration.
 *
 * Features:
 * - Displays a success message and a call to action to check email.
 * - Provides a button to resend the confirmation email.
 * - Calls the `useAccount().resendConfirmationEmail` mutation on button click.
 * - Uses Material UI for styling and layout.
 *
 * Props:
 * @property {Object} RegisterSuccessProps
 * @property {string} [email] - The email address of the newly registered user.
 *
 * Example usage:
 * ```tsx
 * <RegisterSuccess email={user.email} />
 * ```
 */
export default function RegisterSuccess({email}: Props) {
    const {resendConfirmationEmail} = useAccount();

    if (!email) return null;

    return (
        <Paper
        sx={{
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6
        }}
        >
            <Check sx={{fontSize: 100}} color="primary"/>
            <Typography gutterBottom variant="h3">
                You have successfully registered!
            </Typography>
            <Typography gutterBottom variant="h3">
                Please check your email to confirm your account
            </Typography>
            <Button fullWidth onClick={() => resendConfirmationEmail.mutate({email})}>
                Re-send confirmation email
            </Button>
        </Paper>
    )
}
