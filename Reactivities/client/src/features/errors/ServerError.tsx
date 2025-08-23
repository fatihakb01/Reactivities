import { Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router";

/**
 * A component to display detailed information about a server error.
 *
 * This component is used to show a user-friendly error page when a backend
 * API call fails, leveraging the state passed via the router.
 *
 * Features:
 * - Retrieves error state from the `useLocation` hook.
 * - Conditionally displays a detailed error message if available.
 * - Provides a generic error message if no detailed state is present.
 * - Uses Material UI for styling and layout.
 *
 * Example usage:
 * ```tsx
 * // Renders when a server error occurs, typically with state passed from a route guard or API call
 * <ServerError />
 * ```
 */
export default function ServerError() {
    const { state } = useLocation();

    return (
        <Paper>
            {state.error ? (
                <>
                    <Typography gutterBottom variant="h3" sx={{px: 4, pt: 2}} color="secondary">
                        {state.error?.message || 'There has been an error'}
                    </Typography>
                    <Divider />
                    <Typography variant="body1" sx={{p: 4}}>
                        {state.error?.details || 'Internal server error'}
                    </Typography>
                </>
            ) : (
                <Typography variant="h5">Server error</Typography>
            )}
        </Paper>
    )
}