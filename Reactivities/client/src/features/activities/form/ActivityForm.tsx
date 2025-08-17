import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./CategoryOptions";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import LocationInput from "../../../app/shared/components/LocationInput";

/**
 * A form for creating or editing an activity.
 * 
 * Features:
 * - Uses `react-hook-form` with Zod schema validation.
 * - Pre-fills fields if editing an existing activity.
 * - Handles submit by flattening location data and calling
 *   `createActivity` or `updateActivity` mutations.
 * - Includes custom input components (TextInput, SelectInput, DateTimeInput, LocationInput).
 */
export default function ActivityForm() {
  const { control, reset, handleSubmit, setError } = useForm<ActivitySchema>({
    mode: 'onTouched',
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: '',         
      description: '',   
      category: '',      
      location: {
        venue: '',       
        city: '',        
        latitude: undefined,     
        longitude: undefined,
      }
    }
  });
  const navigate = useNavigate();
  const {id} = useParams();
  const {updateActivity, createActivity, activity, isLoadingActivity} = useActivities(id);

  // Reset activity
  useEffect(() => {
    if (activity) reset({
      ...activity,
      location: {
        city: activity.city,
        venue: activity.venue,
        latitude: activity.latitude,
        longitude: activity.longitude
      }
    });
  }, [activity, reset]);

  /**
   * Handles form submission.
   * Flattens the nested location object into top-level fields
   * before calling the appropriate mutation (create or update).
   * @param data The validated activity form data
   */
  const onSubmit = async (data: ActivitySchema) => {
    const {location, ...rest} = data;
    const flattenedData = {...rest, ...location};
    try {
      if (activity) {
        updateActivity.mutate({...activity, ...flattenedData}, {
          onSuccess: () => navigate(`/activities/${activity.id}`),
          onError: (error) => {
            if (Array.isArray(error)) {
                error.forEach(err => {
                    if (err.includes('Date')) setError('date', {message: err});
                })
            }
        }
        })
      } else {
        createActivity.mutate(flattenedData, {
          onSuccess: (id) => navigate(`/activities/${id}`),
          onError: (error) => {
            if (Array.isArray(error)) {
                error.forEach(err => {
                    if (err.includes('Date')) setError('date', {message: err});
                })
            }
        }
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

    // Show message while activity is loading
    if (isLoadingActivity) return <Typography>Loading activity...</Typography>
  

  return (
    <Paper sx={{borderRadius: 3, padding: 3}}>
        <Typography variant="h5" gutterBottom color="primary">
            {activity ? 'Edit activity' : 'Create activity'}
        </Typography>
        <Box component='form' onSubmit={handleSubmit(onSubmit)} display='flex' flexDirection='column' gap={3}> 
            <TextInput label='Title' control={control} name='title' />
            <TextInput label='Description' control={control} name='description' multiline rows={3} />

            <Box display='flex' gap={3}>
              <SelectInput items={categoryOptions} label='Category' control={control} name='category' />
              <DateTimeInput label='Date' control={control} name='date' />
            </Box>
            <LocationInput control={control} label='Enter the location' name="location"></LocationInput>
            
            <Box display='flex' justifyContent='end' gap={3}>
                <Button onClick={() => (navigate(-1))} color='inherit'>Cancel</Button>
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
