import { List, ListItem, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";


function App() {
  // useState defines a state and stores an array of Activity objects.
  const [activities, setActivities] = useState<Activity []>([]);

  // Fetch activities data from api 
  // Use axios.get instead of fetch
  useEffect(() => {
    axios.get<Activity []>('https://localhost:5001/api/activities')
    .then(response => setActivities(response.data)) // update state with newly retrieved data
  }, [])

  //// Previously used code
  // useEffect(() => {
  //   fetch('https://localhost:5001/api/activities')
  //   .then(response => response.json()) // retrieve data
  //   .then(data => setActivities(data)) // update state with newly retrieved data
  // }, [])

  // rendering a list of activity titles (using map)
  return (
    <>
        <Typography variant='h3' className="app" style={{color: 'red'}}>Reactivities</Typography>
        <List>
        
          {activities.map((activity) => (
            <ListItem key={activity.id}>
              <ListItemText>{activity.title}</ListItemText>
            </ListItem>
          ))}
        </List>

    </>
  )
}

export default App
