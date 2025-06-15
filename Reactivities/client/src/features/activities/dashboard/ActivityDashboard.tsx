import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";

// Define properties for this component
type Props = {
    activities: Activity[];
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    selectedActivity?: Activity;
    openForm: (id: string) => void;
    closeForm: () => void;
    editMode: boolean;
    submitForm: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
}

// Display the activities
export default function ActivityDashboard({
  activities, 
  selectActivity, 
  cancelSelectActivity, 
  selectedActivity,
  openForm,
  closeForm,
  editMode,
  submitForm,
  deleteActivity
}: Props) {
  return (
    <Grid container spacing={3}>
        <Grid size={7}>
            <ActivityList 
              activities={activities} 
              selectActivity={selectActivity}
              deleteActivity={deleteActivity}
            />
        </Grid>
        <Grid size={5}>
            {selectedActivity && !editMode && // display a specific activity if you clicked on view
              <ActivityDetail 
                activity={selectedActivity} 
                cancelSelectActivity={cancelSelectActivity}
                openForm={openForm}
              />
            }
            {editMode &&
            <ActivityForm 
              closeForm={closeForm} 
              activity={selectedActivity} 
              submitForm={submitForm}
            />}
        </Grid>
    </Grid>
  )
}