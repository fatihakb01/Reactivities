import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { LoginSchema } from "../schemas/loginSchema"
import agent from "../api/agent"
import { useLocation, useNavigate } from "react-router";
import type { RegisterSchema } from "../schemas/registerSchema";
import { toast } from "react-toastify";

/**
 * React hook for managing user account actions and authentication state.
 * Wraps API calls with React Query for caching and mutations.
 *
 * Features:
 * - `loginUser`: mutation to log a user in
 * - `registerUser`: mutation to create a new user account
 * - `logoutUser`: mutation to log the user out
 * - `currentUser`: the currently logged‑in user (or undefined if none)
 * - `loadingUserInfo`: boolean flag while checking the user’s session
 *
 * On successful login or registration:
 * - Queries are invalidated to refresh data
 * - Navigation redirects (e.g., to `/activities` or `/login`)
 *
 * On logout:
 * - Clears cached user and activity data
 * - Redirects to `/`
 *
 * Example usage:
 * ```tsx
 * const { currentUser, loginUser, logoutUser } = useAccount();
 * 
 * if (currentUser) {
 *   logoutUser.mutate();
 * }
 * ```
 */
export const useAccount = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

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
        },
        onSuccess: () => {
            toast.success('Register successful - you can now login');
            navigate('/login');
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

    const {data: currentUser, isLoading: loadingUserInfo} = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await agent.get<User>('/account/user-info');
            return response.data;
        },
        enabled: !queryClient.getQueryData(['user']) 
            && location.pathname !== '/login'
            && location.pathname !== '/register'
    });

    return {
        loginUser,
        currentUser,
        logoutUser,
        loadingUserInfo,
        registerUser
    }
}
