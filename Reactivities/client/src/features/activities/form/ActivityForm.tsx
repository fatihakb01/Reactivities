import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";

// Display form
export default function ActivityForm() {
  const {id} = useParams();
  const {updateActivity, createActivity, activity, isLoadingActivity} = useActivities(id);
  const navigate = useNavigate();

  // Submit form when clicking on submit button 
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // Turn off default behavior
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data: {[key: string]: FormDataEntryValue} = {};

    // The 'name' property inside each TextField is the key, and the entered value inside each field is the value
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Set activity id if activity exists
    // Update activities/ create an activity after submitting form
    if (activity) {
      data.id = activity.id;
      await updateActivity.mutateAsync(data as unknown as Activity); // cast to Activity type
      navigate(`/activities/${activity.id}`);
    } else {
      createActivity.mutate(data as unknown as Activity, {
        onSuccess: (id) => {
          navigate(`/activities/${id}`);
        }
      }); 
    }

    // Show message while activity is loading
    if (isLoadingActivity) return <Typography>Loading activity...</Typography>

    // Log the submitted activity
    console.log("Submitting activity", data);
  }

  return (
    <Paper sx={{borderRadius: 3, padding: 3}}>
        <Typography variant="h5" gutterBottom color="primary">
            {activity ? 'Edit activity' : 'Create activity'}
        </Typography>
        <Box component='form' onSubmit={handleSubmit} display='flex' flexDirection='column' gap={3}> 
            <TextField name='title' label='Title' defaultValue={activity?.title}/>
            <TextField name='description' label='Description' defaultValue={activity?.description} multiline rows={3}/>
            <TextField name='category' label='Category' defaultValue={activity?.category}/>
            <TextField name='date' label='Date' type="date" 
              defaultValue={activity?.date
                ? new Date(activity.date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
              }
            />
            <TextField name='city' label='City' defaultValue={activity?.city}/>
            <TextField name='venue' label='Venue' defaultValue={activity?.venue}/>
            <Box display='flex' justifyContent='end' gap={3}>
                <Button color='inherit'>Cancel</Button>
                <Button 
                  type="submit" 
                  color='success' 
                  variant='contained'
                  disabled={updateActivity.isPending || createActivity.isPending} 
                >Submit</Button>  
            </Box>
        </Box>
    </Paper>
  )
}