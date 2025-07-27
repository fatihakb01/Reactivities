import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { useAccount } from "../../lib/hooks/useAccount";
import { Link, useLocation, useNavigate } from "react-router";

/**
 * Login form component.
 *
 * Features:
 * - Uses `react-hook-form` with Zod validation (`loginSchema`)
 * - Calls `useAccount().loginUser` on submit
 * - Redirects to the requested page (via `location.state.from`) or `/activities`
 *   after successful login
 * - Provides basic form validation (disable submit until valid)
 * - Material UI for styling and layout
 *
 * Form Fields:
 * - Email
 * - Password
 *
 * Example usage:
 * ```tsx
 * <LoginForm />
 * ```
 */
export default function LoginForm() {
  const {loginUser} = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const {control, handleSubmit, formState: { isValid, isSubmitting }} = useForm<LoginSchema>({
    mode: 'onTouched',
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginSchema) => {
    await loginUser.mutateAsync(data, {
      onSuccess: () => {
        navigate(location.state?.from || '/activities')
      }
    });
  }

  return (
    <Paper 
        component='form' 
        onSubmit={handleSubmit(onSubmit)}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            gap: 3,
            maxWidth: 'md',
            mx: 'auto',
            borderRadius: 3
        }}
    >

        <Box 
            display='flex' 
            alignItems='center' 
            justifyContent='center'
            gap={3} 
            color='secondary.main'
        >
            <LockOpen fontSize="large" />
            <Typography variant="h4">Sign in</Typography>
        </Box>
        <TextInput label='Email' control={control} name='email'></TextInput>
        <TextInput label='Password' type='password' control={control} name='password'></TextInput>
        <Button 
            type='submit'
            disabled={!isValid || isSubmitting}
            variant="contained"
            size="large"
        >
            Login
        </Button>
        <Typography sx={{textAlign: 'center'}}>
          Don't have an account?
          <Typography sx={{ml: 2}} component={Link} to='/register' color="primary">
            Sign up
          </Typography>
        </Typography>
    </Paper>
  )
}
