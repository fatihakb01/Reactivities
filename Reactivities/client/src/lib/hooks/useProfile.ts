import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useMemo, useState } from "react";
import type { EditProfileSchema } from "../schemas/editProfileSchema";

/**
 * Custom React hook for fetching and managing a user's profile, photos, followings, and related actions.
 *
 * Integrates with `@tanstack/react-query` to provide:
 * - Profile retrieval
 * - Profile photo management (upload, set as main, delete)
 * - Profile updates (display name, bio)
 * - Following/unfollowing another user
 * - Loading the list of followers or followings
 * - Loading the list of user activities with filters ("past", "hosting", default upcoming)
 *
 * @param {string} [id] - The ID of the user profile to fetch.
 * @param {string} [predicate] - Optional filter for followings query:
 *   - `"followers"`: Fetch users following the profile
 *   - `"followings"`: Fetch users the profile is following
 *
 * @returns {Object} Hook result object
 * @returns {Profile | undefined} return.profile - The loaded profile data.
 * @returns {boolean} return.loadingProfile - Whether profile data is currently loading.
 * @returns {Photo[] | undefined} return.photos - The list of profile photos.
 * @returns {boolean} return.loadingPhotos - Whether photo data is currently loading.
 * @returns {boolean} return.isCurrentUser - Whether the profile belongs to the logged-in user.
 * @returns {Activity[] | undefined} return.userActivities - List of activities for the profile, based on activity filter.
 * @returns {boolean} return.loadingUserActivities - Whether user activities are currently loading.
 * @returns {import("@tanstack/react-query").UseMutationResult<Photo, unknown, Blob>} return.uploadPhoto - Mutation to upload a new photo.
 * @returns {import("@tanstack/react-query").UseMutationResult<void, unknown, Photo>} return.setMainPhoto - Mutation to set a given photo as main.
 * @returns {import("@tanstack/react-query").UseMutationResult<void, unknown, string>} return.deletePhoto - Mutation to delete a photo by ID.
 * @returns {import("@tanstack/react-query").UseMutationResult<void, unknown, EditProfileSchema>} return.updateProfile - Mutation to update profile info.
 * @returns {import("@tanstack/react-query").UseMutationResult<void>} return.updateFollowing - Mutation to follow/unfollow a user.
 * @returns {Profile[] | undefined} return.followings - List of followers or followings based on `predicate`.
 * @returns {boolean} return.loadingFollowings - Whether followings data is loading.
 *
 * @example
 * // Fetch and update profile
 * const { profile, updateProfile } = useProfile('user-123');
 * updateProfile.mutate({ displayName: 'New Name', bio: 'Updated bio' });
 *
 * @example
 * // Fetch user activities
 * const { userActivities } = useProfile('user-123');
 *
 * @example
 * // Upload a photo
 * const { uploadPhoto } = useProfile('user-123');
 * uploadPhoto.mutate(fileBlob);
 *
 * @example
 * // Toggle following another user
 * const { updateFollowing } = useProfile('other-user-id');
 * updateFollowing.mutate();
 */
export const useProfile = (id?: string, predicate?: string) => {
    const [filter, setFilter] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const {data: userActivities, isLoading: loadingUserActivities} = useQuery({
        queryKey: ['user-activities', filter],
        queryFn: async () => {
            const response = await agent.get<Activity[]>(`/profiles/${id}/activities`, {
                params: {
                    filter
                }
            });
            return response;
            },
        enabled: !!id && !!filter
    });

    const {data: profile, isLoading: loadingProfile} = useQuery<Profile>({
        queryKey: ['profile', id],
        queryFn: async () => {
            const response = await agent.get<Profile>(`/profiles/${id}`);
            return response.data;
        },
        enabled: !!id && !predicate
    });

    const {data: photos, isLoading: loadingPhotos} = useQuery<Photo[]>({
        queryKey: ['photos', id],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
            return response.data;
        },
        enabled: !!id && !predicate
    });

    const {data: followings, isLoading: loadingFollowings} = useQuery<Profile[]>({
        queryKey: ['followings', id, predicate],
        queryFn: async () => {
            const response = 
                await agent.get<Profile[]>(`/profiles/${id}/follow-list?predicate=${predicate}`);
            return response.data
        },
        enabled: !!id && !!predicate
    });

    const uploadPhoto = useMutation({
        mutationFn: async (file: Blob) => {
            const formData = new FormData();
            formData.append('file', file);
            const response = await agent.post('/profiles/add-photo', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
            return response.data;
        },
        onSuccess: async (photo: Photo) => {
            await queryClient.invalidateQueries({
                queryKey: ['photos', id]
            });
            queryClient.setQueryData(['user'], (data: User) => {
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            });
            queryClient.setQueryData(['profile', id], (data: Profile) => {
                if (!data) return data;
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            });
        }
    });

    const setMainPhoto = useMutation({
        mutationFn: async (photo: Photo) => {
            await agent.put(`/profiles/${photo.id}/setMain`);
        },
        onMutate: async (photo) => {
            await queryClient.cancelQueries({ queryKey: ['profile', id] });
            await queryClient.cancelQueries({ queryKey: ['user'] });
            await queryClient.cancelQueries({ queryKey: ['photos', id] });

            const previousUser = queryClient.getQueryData<User>(['user']);
            const previousProfile = queryClient.getQueryData<Profile>(['profile', id]);
            const previousPhotos = queryClient.getQueryData<Photo[]>(['photos', id]);

            queryClient.setQueryData(['user'], (old: User) => {
                if (!old) return old;
                return {
                    ...old,
                    imageUrl: photo.url
                };
            });

            queryClient.setQueryData(['profile', id], (old: Profile) => {
                if (!old) return old;
                return {
                    ...old,
                    imageUrl: photo.url
                };
            });

            queryClient.setQueryData(['photos', id], (old: Photo[]) => {
                if (!old) return old;
                return old.map(p => ({
                    ...p,
                    isMain: p.id === photo.id
                }));
            });

            return { previousUser, previousProfile, previousPhotos };
        },
        onError: (_err, _photo, context) => {
            if (context?.previousUser) {
                queryClient.setQueryData(['user'], context.previousUser);
            }
            if (context?.previousProfile) {
                queryClient.setQueryData(['profile', id], context.previousProfile);
            }
            if (context?.previousPhotos) {
                queryClient.setQueryData(['photos', id], context.previousPhotos);
            }
        }
    });    

    const updateProfile = useMutation({
        mutationFn: async (profile: EditProfileSchema) => {
            await agent.put(`/profiles`, profile);
        },
        onSuccess: (_, profile) => {
            queryClient.setQueryData(['profile', id], (data: Profile) => {
                if (!data) return data;
                return {
                    ...data,
                    displayName: profile.displayName,
                    bio: profile.bio
                }
            });
            queryClient.setQueryData(['user'], (userData: User) => {
                if (!userData) return userData;
                return {
                    ...userData,
                    displayName: profile.displayName
                }
            });
        }
    });

    const deletePhoto = useMutation({
        mutationFn: async (photoId: string) => {
            await agent.delete(`/profiles/${photoId}/photos`);
        },
        onSuccess: (_, photoId) => {
            queryClient.setQueryData(['photos', id], (photos: Photo[]) => {
                return photos?.filter(x => x.id !== photoId)
            })
        }
    });

    const updateFollowing = useMutation({
        mutationFn: async () => {
            await agent.post(`/profiles/${id}/follow`)
        },
        onSuccess: () => {
            queryClient.setQueryData(['profile', id], (profile: Profile) => {
                queryClient.invalidateQueries({queryKey: ['followings', id, 'followers']})
                if (!profile || profile.followersCount === undefined) return profile;
                return {
                    ...profile,
                    following: !profile.following,
                    followersCount: profile.following 
                        ? profile.followersCount - 1 
                        : profile.followersCount + 1
                }
            })
        }
    });

    const isCurrentUser = useMemo(() => {
        return id === queryClient.getQueryData<User>(['user'])?.id
    }, [id, queryClient]);

    return {
        profile,
        loadingProfile,
        photos,
        loadingPhotos,
        isCurrentUser,
        uploadPhoto,
        updateProfile,
        setMainPhoto,
        deletePhoto,
        updateFollowing,
        followings,
        loadingFollowings,
        userActivities,
        loadingUserActivities,
        setFilter,
        filter
    }
}
