import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import { Box, Button, Divider, Typography } from "@mui/material";

/**
 * Displays the user's "About" section inside their profile.
 *
 * Features:
 * - Shows user's display name and bio.
 * - Placeholder if no bio is available.
 * - Includes an edit button (logic not implemented).
 *
 * Fetches profile data via `useProfile`, using the ID from the route.
 *
 * @example
 * <ProfileAbout />
 */
export default function ProfileAbout() {
    const {id} = useParams();
    const {profile} = useProfile(id);

    return (
        <Box>
            <Box display='flex' justifyContent='space-between'>
                <Typography variant="h5"> {profile?.displayName} </Typography>
                <Button>
                    Edit profile
                </Button>
            </Box>
            <Divider sx={{my: 2}} />
            <Box sx={{overflow: 'auto', maxHeight: 350}}>
                <Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>
                    {profile?.bio || 'No description added yet'}
                </Typography>
            </Box>
        </Box>
    )
}
