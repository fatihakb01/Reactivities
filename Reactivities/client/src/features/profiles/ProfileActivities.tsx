import { useEffect, useState, type SyntheticEvent } from "react";
import { useProfile } from "../../lib/hooks/useProfile";
import { Link, useParams } from "react-router";
import { Box, Card, CardContent, CardMedia, Grid, Tab, Tabs, Typography } from "@mui/material";
import { format } from "date-fns";

/**
 * Component for displaying a user's activities (future, past, or hosting) in tabbed sections.
 *
 * Features:
 * - Three tabs for filtering activities:
 *   - `"future"`: Upcoming activities the user is involved in
 *   - `"past"`: Activities that have already occurred
 *   - `"hosting"`: Activities the user is hosting
 * - Automatically defaults to `"future"` on mount
 * - Integrates with `useProfile` to load filtered activities
 * - Displays a grid of activity cards with:
 *   - Category image
 *   - Title
 *   - Date and time (formatted with `date-fns`)
 * - Links each activity to its detailed view
 *
 * @component
 *
 * @example
 * // Renders the profile activities view for the user with ID in the URL
 * <ProfileActivities />
 */
export default function ProfileActivities() {
    const [activeTab, setActiveTab] = useState(0);
    const { id } = useParams();
    const { userActivities, setFilter, loadingUserActivities } = useProfile(id);

    useEffect(() => {
        setFilter('future')
    }, [setFilter])

    const tabs = [
        { menuItem: 'Future Events', key: 'future' },
        { menuItem: 'Past Events', key: 'past' },
        { menuItem: 'Hosting', key: 'hosting' }
    ];

    const handleTabChange = (_: SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setFilter(tabs[newValue].key);
    };

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                    >
                        {tabs.map((tab, index) => (
                            <Tab label={tab.menuItem} key={index} />
                        ))}
                    </Tabs>
                </Grid>
            </Grid>
            {(!userActivities || userActivities.data.length === 0) 
                && !loadingUserActivities ? (
                <Typography mt={2}>
                    No activities to show
                </Typography>
            ) : null}
            <Grid
                container 
                spacing={2} 
                sx={{ marginTop: 2, height: 400, overflow: 'auto' }}
            >
                {userActivities && userActivities.data.map((activity: Activity) => (
                    <Grid size={2} key={activity.id}>
                        <Link to={`/activities/${activity.id}`} 
                        style={{ textDecoration: 'none' }}>
                            <Card elevation={4}>
                                <CardMedia
                                    component="img"
                                    height="100"
                                    image={
                                    `/images/categoryImages/${activity.category}.jpg`
                                   }
                                    alt={activity.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography variant="h6" textAlign="center" mb={1}>
                                        {activity.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        textAlign="center"
                                        display='flex'
                                        flexDirection='column'
                                    >
                                        <span>
                                        {format(activity.date, 'do LLL yyyy')}
                                       </span>
                                        <span>{format(activity.date, 'h:mm a')}</span>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}