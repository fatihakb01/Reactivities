import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import type { Activity } from "../types";

/**
 * Custom hook for fetching and mutating activity data.
 * 
 * @param id - Optional ID of a specific activity. If provided, the hook will also fetch that activity.
 * @returns An object containing:
 * - `activities`: A list of all activities (if `id` not provided)
 * - `activity`: A single activity (if `id` provided)
 * - `isPending`: Whether the activities list is still loading
 * - `isLoadingActivity`: Whether a single activity is still loading
 * - `updateActivity`: Mutation function for updating activities
 * - `createActivity`: Mutation function for creating activities
 * - `deleteActivity`: Mutation function for deleting activities
 *
 * Internally, this hook uses React Query to:
 * - Cache results
 * - Invalidate queries after mutations to refresh data
 */
export const useActivities = (id?: string) => {
    const queryClient = useQueryClient();
    const location = useLocation();

    // Fetch list of activities (only when not viewing a specific one)
    const {data: activities, isPending} = useQuery({
        queryKey: ['activities'],
        queryFn: async () => {
        const response = await agent.get<Activity[]>('/activities');
        return response.data;
        },
        enabled: !id && location.pathname === '/activities'
        // staleTime: 1000 * 6 * 5 // The time it takes before an activity is marked as stale (default stale time is 0)
    });

    // Fetch a single activity when id is provided
    const {data: activity, isLoading: isLoadingActivity} = useQuery({
        queryKey: ['activities', id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/activities/${id}`);
            return response.data;
        },
        enabled: !!id // if id is not available, then don't send request to api, otherwise send request to api
    });

    // Mutation to update an existing activity
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

    // Mutation to create a new activity
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

    // Mutation to delete an activity
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