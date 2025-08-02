import { CalendarToday, Info, Place } from "@mui/icons-material";
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { formatDate } from "../../../lib/util/util";
import { useState } from "react";
import MapComponent from "../../../app/shared/components/MapComponent";

type Props = {
    activity: Activity
}

/**
 * Displays general information about the given activity, such as description, date,
 * venue, and an optional embedded map toggle.
 *
 * Props:
 * @param {Activity} props.activity - The activity object to display details for
 *
 * Features:
 * - Shows activity description, formatted date, and location
 * - Toggles a map display (via `MapComponent`) on button click
 * - Responsive layout using MUI Grid and Paper components
 * 
 * Usage:
 * ```tsx
 * <ActivityDetailsInfo activity={selectedActivity} />
 * ```
 */
export default function ActivityDetailsInfo({activity}: Props) {
    const [mapOpen, setMapOpen] = useState(false);

    return (
        <Paper sx={{ mb: 2 }}>

            <Grid container alignItems="center" pl={2} py={1}>
                <Grid size={1}>
                    <Info color="info" fontSize="large" />
                </Grid>
                <Grid size={11}>
                    <Typography>{activity.description}</Typography>
                </Grid>
            </Grid>
            <Divider />
            <Grid container alignItems="center" pl={2} py={1}>
                <Grid size={1}>
                    <CalendarToday color="info" fontSize="large" />
                </Grid>
                <Grid size={11}>
                    <Typography>{formatDate(activity.date)}</Typography>
                </Grid>
            </Grid>
            <Divider />

            <Grid container alignItems="center" pl={2} py={1}>
                <Grid size={1}>
                    <Place color="info" fontSize="large" />
                </Grid>
                <Grid size={11} display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography>
                        {activity.venue}, {activity.city}
                    </Typography>
                    <Button sx={{whiteSpace: 'nowrap', mx: 2}} onClick={() => setMapOpen(!mapOpen)}>
                        {mapOpen ? 'Hide map' : 'Show map'}
                    </Button>
                </Grid>
            </Grid>
            {mapOpen && (
                <Box sx={{height: 400, zIndex: 1000, display: 'block'}}>
                    <MapComponent 
                        position={[activity.latitude, activity.longitude]} 
                        venue={activity.venue}
                    />
                </Box>
            )}
        </Paper>
    )
}
