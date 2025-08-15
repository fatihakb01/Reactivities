import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";
import { useStore } from "./useStore";

/**
 * React hook for managing activity data using React Query and a REST API.
 *
 * Features:
 * - Fetches a paginated list of activities or a single activity based on an optional ID
 * - Supports cursor-based pagination with `NextCursor` for infinite scrolling
 * - Filters activities (e.g., all, "isGoing", "isHost")
 * - Performs create, update, and delete operations
 * - Optimistically updates attendance with rollback support on error
 * - Enriches activities with user-related flags (`isHost`, `isGoing`)
 * - Automatically invalidates cached queries to keep data in sync
 *
 * @param {string} [id] - Optional activity ID. If provided, fetches a single activity.
 *
 * @returns {Object} Hook result object
 * @returns {Activity[] | undefined} return.activities - The loaded list of activities.
 * @returns {Activity | undefined} return.activity - The currently selected activity (if `id` is provided).
 * @returns {boolean} return.isLoading - Whether the activity list is currently loading.
 * @returns {boolean} return.isLoadingActivity - Whether the single activity is currently loading.
 * @returns {import("@tanstack/react-query").UseMutationResult<unknown, unknown, Activity>} return.createActivity - Mutation to create a new activity.
 * @returns {import("@tanstack/react-query").UseMutationResult<void, unknown, Activity>} return.updateActivity - Mutation to update an existing activity.
 * @returns {import("@tanstack/react-query").UseMutationResult<void, unknown, string>} return.deleteActivity - Mutation to delete an activity by ID.
 * @returns {import("@tanstack/react-query").UseMutationResult<void, unknown, string, { prevActivity?: Activity }>} return.updateAttendance - Mutation to toggle attendance.
 * @returns {Function} return.fetchNextPage - Function to load the next page of activities.
 * @returns {boolean} return.hasNextPage - Whether more pages are available for loading.
 *
 * @example
 * // Fetch activities with infinite scroll:
 * const { activities, fetchNextPage, hasNextPage } = useActivities();
 *
 * // Fetch a single activity by ID:
 * const { activity, isLoadingActivity } = useActivities('123');
 *
 * // Create an activity:
 * createActivity.mutate(newActivity);
 *
 * // Update attendance:
 * updateAttendance.mutate('activity-id');
 */
export const useActivities = (id?: string) => {
    const {activityStore: {filter, startDate}} = useStore();
    const queryClient = useQueryClient();
    const {currentUser} = useAccount();
    const location = useLocation();

    const {data: activitiesGroup, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage} 
        = useInfiniteQuery<PagedList<Activity, string>>({
        queryKey: ['activities', filter, startDate],
        queryFn: async ({pageParam = null}) => {
            const response = await agent.get<PagedList<Activity, string>>('/activities', {
                params: {
                    cursor: pageParam,
                    pageSize: 3,
                    filter,
                    startDate
                }
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !id && location.pathname === '/activities' && !!currentUser,
        select: data => ({
            ...data,
            pages: data.pages.map((page) => ({
                ...page,
                items: page.items.map(activity => {
                    const host = activity.attendees.find(x => x.id === activity.hostId);
                    return {
                        ...activity,
                        isHost: currentUser?.id === activity.hostId,
                        isGoing: activity.attendees.some(x => x.id === currentUser?.id),
                        hostImageUrl: host?.imageUrl
                    }
                })
            }))
        })
    });

    const {data: activity, isLoading: isLoadingActivity} = useQuery({
        queryKey: ['activities', id],
        queryFn: async () => {
            const response = await agent.get<Activity>(`/activities/${id}`);
            return response.data;
        },
        enabled: !!id && !!currentUser,
        select: data => {
            const host = data.attendees.find(x => x.id === data.hostId);
            return {
                ...data,
                isHost: currentUser?.id === data.hostId,
                isGoing: data.attendees.some(x => x.id === currentUser?.id),
                hostImageUrl: host?.imageUrl
            }
        }
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

    const updateAttendance = useMutation({
        mutationFn: async (id: string) => {
            await agent.post(`/activities/${id}/attend`)
        },
        onMutate: async (activityId: string) => {
            await queryClient.cancelQueries({queryKey: ['activities', activityId]});

            const prevActivity = queryClient.getQueryData<Activity>(['activities', activityId]);

            queryClient.setQueryData<Activity>(['activities', activityId], oldActivity => {
                if (!oldActivity || !currentUser) {
                    return oldActivity
                }

                const isHost = oldActivity.hostId === currentUser.id;
                const isAttending = oldActivity.attendees.some(x => x.id === currentUser.id);

                return {
                    ...oldActivity,
                    isCancelled: isHost ? !oldActivity.isCancelled : oldActivity.isCancelled,
                    attendees: isAttending
                        ? isHost 
                            ? oldActivity.attendees
                            : oldActivity.attendees.filter(x => x.id !== currentUser.id) 
                        : [...oldActivity.attendees, {
                            id: currentUser.id,
                            displayName: currentUser.displayName,
                            imageUrl: currentUser.imageUrl
                        }]

                }
            })

            return {prevActivity};
        },
        onError: (error, activityId, context) => {
            console.log(error);
            if (context?.prevActivity) {
                queryClient.setQueryData(['activities', activityId], context.prevActivity)
            }
        }
    })

    return {
        activitiesGroup,
        isFetchingNextPage, 
        fetchNextPage, 
        hasNextPage,
        isLoading,
        updateActivity,
        createActivity,
        deleteActivity,
        updateAttendance,
        activity,
        isLoadingActivity
    }
}
