using System;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

/// <summary>
/// Query handler for retrieving all photos associated with a user profile.
/// </summary>
public class GetProfilePhotos
{
    /// <summary>
    /// Request object containing the target user ID.
    /// </summary>
    public class Query : IRequest<Result<List<Photo>>>
    {
        /// <summary>
        /// The ID of the user whose photos should be retrieved.
        /// </summary>
        public required string UserId { get; set; }
    }

    /// <summary>
    /// Handles the <see cref="Query"/> to return all profile photos for a given user.
    /// </summary>
    /// <param name="context">The application database context.</param>
    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<List<Photo>>>
    {
        public async Task<Result<List<Photo>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var photos = await context.Users
                .Where(x => x.Id == request.UserId)
                .SelectMany(x => x.Photos)
                .ToListAsync(cancellationToken);

            return Result<List<Photo>>.Success(photos);
        }
    }
}
