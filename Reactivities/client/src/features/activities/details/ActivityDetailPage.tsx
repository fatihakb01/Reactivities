import { Grid, Typography } from "@mui/material"
import { useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfo from "./ActivityDetailsInfo";
import ActivityDetailsChat from "./ActivityDetailsChat";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";

/**
 * Displays the detailed view of a single activity.
 *
 * Features:
 * - Retrieves an activity by its `id` from the URL params using `useParams`.
 * - Fetches activity data using the `useActivities` hook.
 * - Shows loading and not-found fallback messages appropriately.
 * - Renders subcomponents to display:
 *    - Header information (`ActivityDetailsHeader`)
 *    - Description and location details (`ActivityDetailsInfo`)
 *    - Comment/chat section (`ActivityDetailsChat`)
 *    - Sidebar with attendees and management buttons (`ActivityDetailsSidebar`)
 *
 * Behavior:
 * - If the activity is still loading, it shows a loading message.
 * - If no activity is found, it displays an error message.
 *
 * Layout:
 * - Uses a two-column grid layout with 8:4 ratio for main content and sidebar.
 *
 * Dependencies:
 * - Relies on routing (`useParams`) and the activity-fetching hook (`useActivities(id)`).
 *
 * Usage:
 * ```tsx
 * <Route path="/activities/:id" element={<ActivityDetailPage />} />
 * ```
 */
export default function ActivityDetailPage() {
   const {id} = useParams();
   const {activity, isLoadingActivity} = useActivities(id);

   if (isLoadingActivity) return <Typography>Loading...</Typography>
   if (!activity) return <Typography>Activity not found...</Typography>

  return (
    <Grid container spacing={3}>
        <Grid size={8}>
            <ActivityDetailsHeader activity={activity} />
            <ActivityDetailsInfo activity={activity} />
            <ActivityDetailsChat />
        </Grid>
        <Grid size={4}>
            <ActivityDetailsSidebar activity={activity}/>
        </Grid>
    </Grid>
  )
}
