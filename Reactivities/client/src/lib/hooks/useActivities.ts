import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";

/**
 * React hook for managing activities (list, detail, create, update, delete)
 * using React Query for data fetching, caching, and invalidation.
 *
 * Features:
 * - Fetches a list of activities (when `id` is not provided)
 * - Fetches a single activity (when `id` is provided)
 * - Provides mutations for creating, updating, and deleting activities
 * - Automatically invalidates and refreshes the activity list after mutations
 * - Only fetches when a user is authenticated (via `useAccount`)
 * - Fetching is context‑aware: list fetch only triggers on `/activities` route
 *
 * @param id Optional activity ID. When provided, the hook fetches details
 *           of that specific activity instead of the entire list.
 *
 * @returns An object with:
 *  - `activities`: Activity[] | undefined – all activities
 *  - `activity`: Activity | undefined – details of a single activity
 *  - `isLoading`: boolean – whether the list is loading
 *  - `isLoadingActivity`: boolean – whether the single activity is loading
 *  - `createActivity`: mutation object to create a new activity
 *  - `updateActivity`: mutation object to update an existing activity
 *  - `deleteActivity`: mutation object to delete an activity
 *
 * Example usage:
 * ```tsx
 * const { activities, isLoading, createActivity } = useActivities();
 * // or for detail:
 * const { activity, isLoadingActivity } = useActivities('some-id');
 * ```
 */
export const useActivities = (id?: string) => {
    const queryClient = useQueryClient();
    const {currentUser} = useAccount();
    const location = useLocation();

    const {data: activities, isLoading} = useQuery({
        queryKey: ['activities'],
        queryFn: async () => {
        const response = await agent.get<Activity[]>('/activities');
        return response.data;
        },
        enabled: !id && location.pathname === '/activities' && !!currentUser
    });

    const {data: activity, isLoading: isLoadingActivity} = useQuery({
        queryKey: ['activities', id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/activities/${id}`);
            return response.data;
        },
        enabled: !!id && !!currentUser 
    });

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
        isLoading,
        updateActivity,
        createActivity,
        deleteActivity,
        activity,
        isLoadingActivity
    }
}
