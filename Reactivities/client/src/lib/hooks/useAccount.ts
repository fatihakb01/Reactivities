import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { LoginSchema } from "../schemas/loginSchema"
import agent from "../api/agent"
import { useNavigate } from "react-router";
import type { RegisterSchema } from "../schemas/registerSchema";
import { toast } from "react-toastify";
import type { ChangePasswordSchema } from "../schemas/changePasswordSchema";

/**
 * A custom React hook for managing user account-related actions and authentication state.
 *
 * This hook centralizes all API calls related to user accounts (e.g., login, register,
 * password management) and wraps them with `react-query` mutations for efficient
 * state management, caching, and background synchronization.
 *
 * Features:
 * - `loginUser`: A mutation for user login.
 * - `registerUser`: A mutation for new user registration.
 * - `logoutUser`: A mutation to log the current user out.
 * - `verifyEmail`: A mutation to confirm a user's email address.
 * - `resendConfirmationEmail`: A mutation to resend the email verification link.
 * - `changePassword`: A mutation to change a user's password.
 * - `forgotPassword`: A mutation to request a password reset link.
 * - `resetPassword`: A mutation to set a new password using a reset code.
 * - `currentUser`: A query that fetches the currently authenticated user's information.
 * - `loadingUserInfo`: A boolean flag indicating if the user data is currently being fetched.
 *
 * Example usage:
 * ```tsx
 * const { currentUser, loginUser, logoutUser } = useAccount();
 *
 * if (currentUser) {
 * logoutUser.mutate();
 * }
 * ```
 */
export const useAccount = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const loginUser = useMutation({
        mutationFn: async (creds: LoginSchema) => {
            await agent.post('/login?useCookies=true', creds);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['user']
            });
        }
    });

    const registerUser = useMutation({
        mutationFn: async (creds: RegisterSchema) => {
            await agent.post('/account/register', creds)
        }
    })

    const logoutUser = useMutation({
        mutationFn: async () => {
            await agent.post('/account/logout');
        },
        onSuccess: () => {
            queryClient.removeQueries({queryKey: ['user']});
            queryClient.removeQueries({queryKey: ['activities']});
            navigate('/')
        }
    });

    const verifyEmail = useMutation({ 
        mutationFn: async ({userId, code}: {userId: string, code: string}) => {
            await agent.get(`/account/confirmEmail?userId=${userId}&code=${code}`)
        }                   
    });

    const resendConfirmationEmail = useMutation({
        mutationFn: async ({email, userId}: {email?: string, userId?: string | null}) => {
            await agent.get(`/account/resendConfirmEmail`, {
                params: {
                    email, 
                    userId
                }
            })
        },
        onSuccess: () => {
            toast.success('Email sent - please check your email')
        }
    })

    const {data: currentUser, isLoading: loadingUserInfo} = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await agent.get<User>('/account/user-info');
            return response.data;
        },
        enabled: !queryClient.getQueryData(['user']) 
    });

    const changePassword = useMutation({
        mutationFn: async (data: ChangePasswordSchema) => {
            await agent.post('/account/change-password', data)
        }
    })

    const forgotPassword = useMutation({
        mutationFn: async (email: string) => {
            await agent.post('/forgotPassword', {email})
        }
    })

    const resetPassword = useMutation({
        mutationFn: async (data: ResetPassword) => {
            await agent.post('/resetPassword', data)
        }
    })

    return {
        loginUser,
        currentUser,
        logoutUser,
        loadingUserInfo,
        registerUser,
        verifyEmail,
        resendConfirmationEmail,
        changePassword,
        forgotPassword,
        resetPassword
    }
}
