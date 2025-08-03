using System;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Profiles.Command;

/// <summary>
/// Command handler for deleting a user photo.
/// </summary>
public class DeletePhoto
{
    /// <summary>
    /// Represents a request to delete a user photo.
    /// </summary>
    public class Command : IRequest<Result<Unit>>
    {
        /// <summary>
        /// The ID of the photo to be deleted.
        /// </summary>
        public required string PhotoId { get; set; }
    }

    /// <summary>
    /// Handles the deletion of a photo from cloud storage and user profile.
    /// </summary>
    /// <param name="context">The application's database context.</param>
    /// <param name="userAccessor">Provides access to the currently authenticated user.</param>
    /// <param name="photoService">The service responsible for deleting the image from storage.</param>
    public class Handler(AppDbContext context, IUserAccessor userAccessor, IPhotoService photoService)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserWithPhotosAsync();

            var photo = user.Photos.FirstOrDefault(x => x.Id == request.PhotoId);

            if (photo == null) return Result<Unit>.Failure("Cannot find photo", 400);

            if (photo.Url == user.ImageUrl) return Result<Unit>.Failure("Cannot delete main photo", 400);

            await photoService.DeletePhoto(photo.PublicId);

            user.Photos.Remove(photo);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem deleting photo", 400);
        }
    }
}
