using System;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Profiles.Command;

/// <summary>
/// Command handler for uploading and saving a new user photo.
/// </summary>
public class AddPhoto
{
    /// <summary>
    /// Represents a request to upload a user profile photo.
    /// </summary>
    public class Command : IRequest<Result<Photo>>
    {
        /// <summary>
        /// The image file to be uploaded.
        /// </summary>
        public required IFormFile File { get; set; }
    }

    /// <summary>
    /// Handles photo upload, saving it to cloud storage and associating it with the user.
    /// </summary>
    /// <param name="userAccessor">Provides access to the currently authenticated user.</param>
    /// <param name="context">The application's database context.</param>
    /// <param name="photoService">The service used to upload the image to cloud storage.</param>
    public class Handler(IUserAccessor userAccessor, AppDbContext context, IPhotoService photoService)
        : IRequestHandler<Command, Result<Photo>>
    {
        public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
        {
            var uploadResult = await photoService.UploadPhoto(request.File);

            if (uploadResult == null) return Result<Photo>.Failure("Failed to upload photo", 400);

            var user = await userAccessor.GetUserAsync();

            var photo = new Photo
            {
                Url = uploadResult.Url,
                PublicId = uploadResult.PublicId,
                UserId = user.Id
            };

            user.ImageUrl ??= photo.Url;

            context.Photos.Add(photo);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Photo>.Success(photo)
                : Result<Photo>.Failure("Problem saving photo to DB", 400);
        }
    }
}
