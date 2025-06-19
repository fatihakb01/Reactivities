import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

// Responsible for fetching data from our api
export const useActivities = (id?: string) => {
    const queryClient = useQueryClient();

    // Fetch activities data from api with react query
    const {data: activities, isPending} = useQuery({
        queryKey: ['activities'],
        queryFn: async () => {
        const response = await agent.get<Activity[]>('/activities');
        return response.data;
        }
    });

    // Fetch the data of a specific activity from api with react query
    const {data: activity, isLoading: isLoadingActivity} = useQuery({
        queryKey: ['activities', id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/activities/${id}`);
            return response.data;
        },
        enabled: !!id // if id is not available, then don't send request to api, otherwise send request to api
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
            const response = await agent.post('/activities', activity);
            return response.data;
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
        deleteActivity,
        activity,
        isLoadingActivity
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