import { Box } from "@mui/material";
import ActivityCard from "./ActivityCard";

// Define properties for this component
type Props = {
    activities: Activity[];
    selectActivity: (id: string) => void;
}

// Show each activity in a card
// rendering a list of activity titles (using map)
export default function ActivityList({activities, selectActivity}: Props) {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
        {activities.map(activity => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              selectActivity={selectActivity}
            />
        ))}
    </Box>
  )
}