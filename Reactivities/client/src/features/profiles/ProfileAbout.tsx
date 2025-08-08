import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import ProfileEdit from "./ProfileEditForm";

/**
 * Displays the user's "About" section inside their profile.
 *
 * Features:
 * - Shows user's display name and bio in read-only mode.
 * - Allows the current user to edit their profile details.
 * - Switches between read-only and edit mode with a toggle button.
 *
 * Fetches profile data via `useProfile`, using the ID from the route.
 *
 * @example
 * <ProfileAbout />
 */
export default function ProfileAbout() {
    const { id } = useParams();
    const { profile, isCurrentUser } = useProfile(id);
    const [editMode, setEditMode] = useState(false);

    return (
        <Box>
            {editMode ? (
                <>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h5">Edit Profile</Typography>
                        <Button onClick={() => setEditMode(false)}>Cancel</Button>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <ProfileEdit setEditMode={setEditMode} />
                </>
            ) : (
                <>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h5">About {profile?.displayName}</Typography>
                        {isCurrentUser && (
                            <Button onClick={() => setEditMode(true)}>
                                Edit profile
                            </Button>
                        )}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ overflow: "auto", maxHeight: 350 }}>
                        <Typography
                            variant="body1"
                            sx={{ whiteSpace: "pre-wrap" }}
                        >
                            {profile?.bio || "No description added yet"}
                        </Typography>
                    </Box>
                </>
            )}
        </Box>
    );
}
