import { Avatar, Box, Button, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useProfile } from '../../lib/hooks/useProfile';

/**
 * Displays a user's profile header with their avatar, name, follow status, and social stats.
 *
 * Features:
 * - Shows avatar, display name, and a "Following" chip.
 * - Displays follower/following counts.
 * - Includes a button to follow/unfollow the user.
 *
 * @example
 * <ProfileHeader />
 */
export default function ProfileHeader() {
    const {id} = useParams();
    const {isCurrentUser, profile, updateFollowing} = useProfile(id);

    if (!profile) return null;

    return (
        <Paper elevation={3} sx={{p: 4, borderRadius: 3}}>
            <Grid container spacing={2}>
                <Grid size={8}>
                    <Stack direction='row' spacing={3} alignItems='center'>
                        <Avatar 
                            src={profile.imageUrl}
                            alt={profile.displayName + ' image'}
                            sx={{width: 150, height: 150}}
                        />
                        <Box display='flex' flexDirection='column' gap={2}>
                            <Typography variant="h4">{profile.displayName}</Typography>
                            {profile.following && <Chip 
                                variant="outlined" 
                                color="secondary" 
                                label="Following"
                                sx={{borderRadius: 1}}
                            />}
                        </Box>
                    </Stack>
                </Grid>
                <Grid size={4}>
                    <Stack spacing={2} alignItems='center'>
                        <Box display='flex' justifyContent='space-around' width='100%'>
                            <Box textAlign='center'>
                                <Typography variant="h6">Followers</Typography>
                                <Typography variant="h3">{profile.followersCount}</Typography>
                            </Box>
                            <Box textAlign='center'>
                                <Typography variant="h6">Following</Typography>
                                <Typography variant="h3">{profile.followingCount}</Typography>
                            </Box>
                        </Box>
                        {!isCurrentUser &&
                            <>
                                <Divider sx={{width: '100%'}}/>
                                <Button 
                                    onClick={() => updateFollowing.mutate()}
                                    disabled={updateFollowing.isPending}
                                    fullWidth
                                    variant="outlined"
                                    color={profile.following ? 'error' : 'success'}
                                >
                                        {profile.following ? 'Unfollow' : 'Follow'}
                                </Button>
                            </>
                        }
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    )
}
