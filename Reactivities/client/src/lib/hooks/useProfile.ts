import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useMemo } from "react";

/**
 * React hook for retrieving and managing a user's profile and their photos.
 *
 * Features:
 * - Fetches profile and photo data for a given user ID.
 * - Supports uploading, setting main, and deleting profile photos.
 * - Updates both the global user and profile cache on mutations.
 * - Detects if the given profile belongs to the current user.
 *
 * @param {string} [id] - The profile ID to fetch and operate on.
 *
 * @returns {{
 *   profile: Profile | undefined,
 *   loadingProfile: boolean,
 *   photos: Photo[] | undefined,
 *   loadingPhotos: boolean,
 *   isCurrentUser: boolean,
 *   uploadPhoto: UseMutationResult<Photo, unknown, Blob>,
 *   setMainPhoto: UseMutationResult<void, unknown, Photo>,
 *   deletePhoto: UseMutationResult<void, unknown, string>
 * }}
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
        setMainPhoto,
        deletePhoto
    }
}