import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

// Responsible for fetching data from our api
export const useActivities = () => {
    const queryClient = useQueryClient();


    // Fetch activities data from api with react query
    const {data: activities, isPending} = useQuery({
        queryKey: ['activities'],
        queryFn: async () => {
        const response = await agent.get<Activity[]>('/activities');
        return response.data;
        }
    });

    // function for updating/editing an activity
    // Invalidating queries typically refers to the process of marking cached data as outdated or removing it entirely, so the system fetches updated data from the source. 
    const updateActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            await agent.put('/activities', activity);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    });

    // function for creating an activity
    const createActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            await agent.post('/activities', activity);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    });    

    // function for creating an activity
    const deleteActivity = useMutation({
        mutationFn: async (id: string) => {
            await agent.delete(`/activities/${id}`);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    });       

    return {
        activities,
        isPending,
        updateActivity,
        createActivity,
        deleteActivity
    }

    // Fetch activities data from api 
    // Use axios.get instead of fetch
    // useEffect(() => {
    //   axios.get<Activity []>('https://localhost:5001/api/activities')
    //   .then(response => setActivities(response.data)) // update state with newly retrieved data
    // }, []);

    //// Previously used code
    // useEffect(() => {
    //   fetch('https://localhost:5001/api/activities')
    //   .then(response => response.json()) // retrieve data
    //   .then(data => setActivities(data)) // update state with newly retrieved data
    // }, [])
}