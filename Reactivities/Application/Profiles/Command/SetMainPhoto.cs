using System;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Profiles.Command;

/// <summary>
/// Command handler for setting a user's main profile photo.
/// </summary>
public class SetMainPhoto
{
    /// <summary>
    /// Represents a request to set a specific photo as the main profile photo.
    /// </summary>
    public class Command : IRequest<Result<Unit>>
    {
        /// <summary>
        /// The ID of the photo to be set as main.
        /// </summary>
        public required string PhotoId { get; set; }
    }

    /// <summary>
    /// Handles updating the user's profile to set a new main image.
    /// </summary>
    /// <param name="context">The application's database context.</param>
    /// <param name="userAccessor">Provides access to the currently authenticated user.</param>
    public class Handler(AppDbContext context, IUserAccessor userAccessor)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserWithPhotosAsync();

            var photo = user.Photos.FirstOrDefault(x => x.Id == request.PhotoId);

            if (photo == null) return Result<Unit>.Failure("Cannot find photo", 400);

            user.ImageUrl = photo.Url;

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem updating the main photo", 400);
        }
    }
}
