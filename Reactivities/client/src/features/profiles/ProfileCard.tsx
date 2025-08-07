import { Person } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, Chip, Divider, Typography } from "@mui/material";
import { Link } from "react-router";

type Props = {
    profile: Profile
}

/**
 * Renders a card that displays a user's profile information.
 *
 * Features:
 * - Shows the user's image and display name.
 * - Optionally displays a "Following" chip.
 * - Displays follower count (currently hardcoded as 20).
 * - Card is wrapped in a link to the profile detail page.
 *
 * Props:
 * @param {Profile} profile - The profile object to display.
 *
 * Usage:
 * ```tsx
 * <ProfileCard profile={profile} />
 * ```
 */
export default function ProfileCard({profile}: Props) {
    const following = false;

    return (
        <Link to={`/profiles/${profile.id}`} style={{textDecoration: 'none'}}>
            <Card 
                sx={{
                    borderRadius: 3, 
                    p: 3, 
                    maxWidth: 300, 
                    textDecoration: 'none'
                }}
                elevation={4}
            >
                <CardMedia 
                    component='img' 
                    src={profile?.imageUrl || '/images/user.png'}
                    sx={{width: '100%', zIndex: 50}}
                    alt={profile.displayName + ' image'}
                />
                <CardContent>
                    <Box display='flex' flexDirection='column' gap={1}>
                        <Typography variant="h5">{profile.displayName}</Typography>
                        {profile.bio && (
                            <Typography
                                variant="body2"
                                sx={{
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {profile.bio}
                            </Typography>
                        )}

                        {following && <Chip size="small" label='Following' 
                        color="secondary" variant="outlined"/>}
                    </Box>
                </CardContent>
                <Divider sx={{mb: 2}} />
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'start'}}>
                    <Person />
                    <Typography sx={{ml: 1}}>20 Followers</Typography>
                </Box>
            </Card>
        </Link>
    )
}