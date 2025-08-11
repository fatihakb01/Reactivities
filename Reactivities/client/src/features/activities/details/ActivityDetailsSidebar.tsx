import { Paper, Typography, List, ListItem, Chip, ListItemAvatar, Avatar, ListItemText, Grid } from "@mui/material";

type Props = {
    activity: Activity
}

/**
 * Displays a sidebar listing all attendees of the given activity.
 * Shows avatars, names, and indicates the host and following status.
 *
 * Props:
 * @param {Activity} props.activity - The activity with attendees to be displayed
 *
 * Features:
 * - Renders total attendee count in a styled header
 * - Displays profile picture, name, and "Following" label for each attendee
 * - Highlights the host with a "Host" chip for each attendee
 * - Uses MUI's Grid, List, Avatar, and Chip components for layout and styling
 * 
 * Usage:
 * ```tsx
 * <ActivityDetailsSidebar activity={activity} />
 * ```
 */
export default function ActivityDetailsSidebar({activity}: Props) {

    return (
        <>
            <Paper
                sx={{
                    textAlign: 'center',
                    border: 'none',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    p: 2,
                }}
            >
                <Typography variant="h6">
                    {activity.attendees.length} people going
                </Typography>
            </Paper>
            <Paper sx={{ padding: 2 }}>
                {activity.attendees.map(attendee => (
                    <Grid key={attendee.id} container alignItems="center">
                        <Grid size={8}>
                            <List sx={{ display: 'flex', flexDirection: 'column' }}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="rounded"
                                            alt={attendee.displayName + ' image'}
                                            src={attendee.imageUrl}
                                            sx={{width: 75, height: 75, mr: 3}}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText>
                                        <Typography variant="h6">
                                            {attendee.displayName}
                                        </Typography>
                                        {attendee.following && (
                                            <Typography variant="body2" color="orange">
                                                Following
                                            </Typography>
                                        )}
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid size={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            {activity.hostId === attendee.id && (
                                <Chip
                                    label="Host"
                                    color="warning"
                                    variant='filled'
                                    sx={{borderRadius: 2}}
                                />
                            )}
                        </Grid>
                    </Grid>
                ))}
            </Paper>
        </>
    );
}
