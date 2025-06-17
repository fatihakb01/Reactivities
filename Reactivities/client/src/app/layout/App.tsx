import { Box, Container, CssBaseline, Typography } from "@mui/material";
import { useState } from "react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { useActivities } from "../../lib/hooks/useActivities";


function App() {
  // useState defines a state for a certain objects
  // const [x, y] means that y returns the value that is used to update the state of x
  // const [activities, setActivities] = useState<Activity []>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const {activities, isPending} = useActivities();


  // Select a specific activity (when clicking on view)
  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities!.find(x => x.id === id));
  }

  // Cancel a specific activity (when clicking on cancel)
  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
  }

  // Open form
  const handleOpenForm = (id?: string) => {
    if (id) handleSelectActivity(id);
    else handleCancelSelectActivity();
    setEditMode(true);
  }

  // Close form
  const handleFormClose = () => {
    setEditMode(false);
  }
  
  return (
    <Box sx={{bgcolor: '#eeeeee', minHeight: '100vh'}}>
        <CssBaseline /> 
        <NavBar openForm={handleOpenForm}/>
        <Container maxWidth='xl' sx={{mt: 3}}>
          {!activities || isPending ? (
            <Typography>Loading...</Typography>
          ) : (
            <ActivityDashboard 
              activities={activities} 
              selectActivity={handleSelectActivity}
              cancelSelectActivity={handleCancelSelectActivity}
              selectedActivity={selectedActivity}
              editMode={editMode}
              openForm={handleOpenForm}
              closeForm={handleFormClose}
            />            
          )}
        </Container>

    </Box>
  )
}

export default App
