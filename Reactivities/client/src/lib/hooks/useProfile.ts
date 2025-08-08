import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useMemo } from "react";
import type { EditProfileSchema } from "../schemas/editProfileSchema";

/**
 * React hook for retrieving, updating, and managing a user's profile and their photos.
 *
 * Features:
 * - Fetches profile and photo data for a given user ID.
 * - Supports uploading, setting main, deleting profile photos, and updating profile details.
 * - Updates both the global user cache and profile cache on mutations.
 * - Detects if the given profile belongs to the current logged-in user.
 *
 * @param {string} [id] - The profile ID to fetch and operate on.
 *
 * @returns {Object} Hook result object.
 * @returns {Profile | undefined} [return.profile] - The profile data for the given ID.
 * @returns {boolean} [return.loadingProfile] - Whether the profile is currently loading.
 * @returns {Photo[] | undefined} [return.photos] - The list of profile photos for the user.
 * @returns {boolean} [return.loadingPhotos] - Whether the photos are currently loading.
 * @returns {boolean} [return.isCurrentUser] - Whether the profile belongs to the current logged-in user.
 * @returns {import("@tanstack/react-query").UseMutationResult<Photo, unknown, Blob>} [return.uploadPhoto] - Mutation to upload a new profile photo.
 * @returns {import("@tanstack/react-query").UseMutationResult<void, unknown, Photo>} [return.setMainPhoto] - Mutation to set a given photo as the main profile photo.
 * @returns {import("@tanstack/react-query").UseMutationResult<void, unknown, string>} [return.deletePhoto] - Mutation to delete a profile photo by ID.
 * @returns {import("@tanstack/react-query").UseMutationResult<void, unknown, EditProfileSchema>} [return.updateProfile] - Mutation to update the profile's display name and bio.
 *
 * @example
 * const { profile, updateProfile } = useProfile('user-id');
 * updateProfile.mutate({ displayName: 'New Name', bio: 'New bio' });
 *
 * @example
 * const { profile, uploadPhoto } = useProfile('user-id');
 * uploadPhoto.mutate(fileBlob);
 */
export const useProfile = (id?: string) => {
    const queryClient = useQueryClient();

    const {data: profile, isLoading: loadingProfile} = useQuery<Profile>({
        queryKey: ['profile', id],
        queryFn: async () => {
            const response = await agent.get<Profile>(`/profiles/${id}`);
            return response.data;
        },
        enabled: !!id
    })

    const {data: photos, isLoading: loadingPhotos} = useQuery<Photo[]>({
        queryKey: ['photos', id],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
            return response.data;
        },
        enabled: !!id
    })

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
    })

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
    })    

    const deletePhoto = useMutation({
        mutationFn: async (photoId: string) => {
            await agent.delete(`/profiles/${photoId}/photos`);
        },
        onSuccess: (_, photoId) => {
            queryClient.setQueryData(['photos', id], (photos: Photo[]) => {
                return photos?.filter(x => x.id !== photoId)
            })
        }
    })

    const isCurrentUser = useMemo(() => {
        return id === queryClient.getQueryData<User>(['user'])?.id
    }, [id, queryClient])

    return {
        profile,
        loadingProfile,
        photos,
        loadingPhotos,
        isCurrentUser,
        uploadPhoto,
        updateProfile,
        setMainPhoto,
        deletePhoto
    }
}