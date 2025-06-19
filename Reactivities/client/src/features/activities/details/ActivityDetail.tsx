import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"
import { Link, useNavigate, useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";

// Display the activity details (next to the activity dashboard)
export default function ActivityDetail() {
   // Find the activity that has been changed 
   const navigate = useNavigate();
   const {id} = useParams();
   const {activity, isLoadingActivity} = useActivities(id);

   // Check whether activity can be found and show a temporary message 
   if (isLoadingActivity) return <Typography>Loading...</Typography>
   if (!activity) return <Typography>Activity not found...</Typography>

  // In the edit & cancel buttons, you can either use the navigate component inside the onClick property
  // or use the Link component inside the component property, which achieves the same behavior 
  return (
    <Card sx={{borderRadius: 3}}>
        <CardMedia 
            component='img'
            src={`/images/categoryImages/${activity.category}.jpg`}
        />
        <CardContent>
            <Typography variant="h5">{activity.title}</Typography>
            <Typography variant="subtitle1" fontWeight='light'>{activity.date}</Typography>
            <Typography variant="body1">{activity.description}</Typography>
        </CardContent>
        <CardActions>
            <Button component={Link} to={`/manage/${activity.id}`} color="primary">Edit</Button> 
            <Button onClick={() => navigate("/activities")} color="inherit">Cancel</Button>
        </CardActions>
    </Card>
  )
}
