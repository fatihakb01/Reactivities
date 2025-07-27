import { Navigate, Outlet, useLocation } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";
import { Typography } from "@mui/material";

/**
 * RequireAuth component
 * ---------------------
 * A route guard component that protects child routes from unauthenticated access.
 *
 * Usage:
 * - Wraps around routes that require authentication in your routing configuration.
 *
 * Behavior:
 * - While user info is loading (`loadingUserInfo`), displays a "Loading..." message.
 * - If no `currentUser` is present (not authenticated), redirects to `/login`
 *   and preserves the current location in the state (`state.from`) so the user
 *   can be redirected back after login.
 * - If authenticated, renders the nested routes via `<Outlet />`.
 *
 * Dependencies:
 * - `useAccount` hook for `currentUser` and loading state.
 * - `useLocation` from `react-router` to capture the current route.
 * - `Navigate` and `Outlet` from `react-router` to handle redirection and nested routing.
 */
export default function RequireAuth() {
    const {currentUser, loadingUserInfo} = useAccount();
    const location = useLocation();

    if (loadingUserInfo) return <Typography>Loading...</Typography>

    if (!currentUser) return <Navigate to='/login' state={{from: location}} />

    return (
        <Outlet />
    )
}
