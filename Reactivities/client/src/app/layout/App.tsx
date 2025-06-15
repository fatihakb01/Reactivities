import { Box, Container, CssBaseline } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";


function App() {
  // useState defines a state for a certain objects
  // const [x, y] means that y returns the value that is used to update the state of x
  const [activities, setActivities] = useState<Activity []>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  // Fetch activities data from api 
  // Use axios.get instead of fetch
  useEffect(() => {
    axios.get<Activity []>('https://localhost:5001/api/activities')
    .then(response => setActivities(response.data)) // update state with newly retrieved data
  }, []);

  //// Previously used code
  // useEffect(() => {
  //   fetch('https://localhost:5001/api/activities')
  //   .then(response => response.json()) // retrieve data
  //   .then(data => setActivities(data)) // update state with newly retrieved data
  // }, [])

  // Select a specific activity (when clicking on view)
  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(x => x.id === id));
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

  // Update activities or create an activity after submitting form
  const handleSubmitForm = (activity: Activity) => {
    if (activity.id) {
      setActivities(activities.map(x => x.id == activity.id ? activity : x));
    } else {
      const newActivity = {...activity, id: activities.length.toString()};
      setSelectedActivity(newActivity);
      setActivities([...activities, newActivity]);
    }
    setEditMode(false);
  }

  // Delete an activity
  const handleDelete = (id: string) => {
    setActivities(activities.filter(x => x.id !== id));
  }
  
  return (
    <Box sx={{bgcolor: '#eeeeee'}}>
        <CssBaseline /> 
        <NavBar openForm={handleOpenForm}/>
        <Container maxWidth='xl' sx={{mt: 3}}>
          <ActivityDashboard 
            activities={activities} 
            selectActivity={handleSelectActivity}
            cancelSelectActivity={handleCancelSelectActivity}
            selectedActivity={selectedActivity}
            editMode={editMode}
            openForm={handleOpenForm}
            closeForm={handleFormClose}
            submitForm={handleSubmitForm}
            deleteActivity={handleDelete}
          />
        </Container>

    </Box>
  )
}

export default App
