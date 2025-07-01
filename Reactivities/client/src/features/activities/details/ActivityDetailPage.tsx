import { Grid, Typography } from "@mui/material"
import { useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfo from "./ActivityDetailsInfo";
import ActivityDetailsChat from "./ActivityDetailsChat";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";

// Display the activity details (next to the activity dashboard)
export default function ActivityDetailPage() {
   // Find the activity that has been changed 
   const {id} = useParams();
   const {activity, isLoadingActivity} = useActivities(id);

   // Check whether activity can be found and show a temporary message 
   if (isLoadingActivity) return <Typography>Loading...</Typography>
   if (!activity) return <Typography>Activity not found...</Typography>

  // In the edit & cancel buttons, you can either use the navigate component inside the onClick property
  // or use the Link component inside the component property, which achieves the same behavior 
  return (
    <Grid container spacing={3}>
        <Grid size={8}>
            <ActivityDetailsHeader activity={activity} />
            <ActivityDetailsInfo activity={activity} />
            <ActivityDetailsChat />
        </Grid>
        <Grid size={4}>
            <ActivityDetailsSidebar />
        </Grid>
    </Grid>
  )
}
