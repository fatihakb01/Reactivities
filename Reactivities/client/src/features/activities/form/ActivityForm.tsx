import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";

type Props = {
    activity?: Activity;
    closeForm: () => void;
    submitForm: (activity: Activity) => void;
}


// Display form
export default function ActivityForm({activity, closeForm, submitForm}: Props) {

  // Submit form when clicking on submit button 
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {

    // Turn off default behavior
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data: {[key: string]: FormDataEntryValue} = {};

    // The 'name' property inside each TextField is the key, and the entered value inside each field is the value
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Set activity id if activity exists
    if (activity) data.id = activity.id;

    // Update activities/ create an activity after submitting form
    submitForm(data as unknown as Activity);

    // Log the submitted activity
    console.log(data);
  }

  return (
    <Paper sx={{borderRadius: 3, padding: 3}}>
        <Typography variant="h5" gutterBottom color="primary">
            Create activity
        </Typography>
        <Box component='form' onSubmit={handleSubmit} display='flex' flexDirection='column' gap={3}> 
            <TextField name='title' label='Title' defaultValue={activity?.title}/>
            <TextField name='description' label='Description' defaultValue={activity?.description} multiline rows={3}/>
            <TextField name='category' label='Category' defaultValue={activity?.category}/>
            <TextField name='date' label='Date' type="date" defaultValue={activity?.date}/>
            <TextField name='city' label='City' defaultValue={activity?.city}/>
            <TextField name='venue' label='Venue' defaultValue={activity?.venue}/>
            <Box display='flex' justifyContent='end' gap={3}>
                <Button onClick={closeForm} color='inherit'>Cancel</Button>
                <Button type="submit" color='success' variant='contained'>Submit</Button>  
            </Box>
        </Box>
    </Paper>
  )
}