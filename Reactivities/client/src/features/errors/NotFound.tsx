import { SearchOff } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router";

/**
 * A component to display for a 404 (Not Found) error page.
 *
 * This component provides a friendly user experience for when a requested page
 * does not exist within the application.
 *
 * Features:
 * - Displays a clear "Not Found" message with a search icon.
 * - Provides a call-to-action button to navigate back to the main activities page.
 * - Uses Material UI for styling and layout.
 *
 * Example usage:
 * ```tsx
 * // Renders on a URL that does not match any route, e.g., /not-found
 * <NotFound />
 * ```
 */
export default function NotFound() {
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
        <SearchOff sx={{fontSize: 100}} color="primary"/>
        <Typography gutterBottom variant="h3">
            Oops - We could not find what you are looking for
        </Typography>
        <Button fullWidth component={Link} to='/activities'>
            Return to the activities page
        </Button>
    </Paper>
  )
}