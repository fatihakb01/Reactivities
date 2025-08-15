import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";

/**
 * Main dashboard layout for displaying activities and filters.
 *
 * Arranges the UI into two sections:
 * - Left: Activity list with infinite scrolling
 * - Right: Activity filter controls (filter type & date)
 *
 * Uses Material UI's `Grid` for responsive layout.
 *
 * @component
 *
 * @example
 * // Render the dashboard
 * <ActivityDashboard />
 */
export default function ActivityDashboard() {

  return (
    <Grid container spacing={3}>
        <Grid size={8}>
            <ActivityList />
        </Grid>
        <Grid 
          size={4}
          sx={{
            position: 'sticky',
            top: 112,
            alignSelf: 'flex-start'
          }}
        >
          <ActivityFilters />
        </Grid>
    </Grid>
  )
}