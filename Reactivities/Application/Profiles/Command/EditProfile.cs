using System;
using System;
 using Application.Core;
 using Application.Interfaces;
 using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Command;

/// <summary>
/// Application logic for editing a user's profile information.
/// </summary>
public class EditProfile
{
    /// <summary>
    /// Represents the data required to update a user's profile.
    /// </summary>
    public class Command : IRequest<Result<Unit>>
    {
        /// <summary>
        /// Gets or sets the new display name for the user.
        /// </summary>
        public string DisplayName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the biography or "about me" section for the user.
        /// </summary>
        public string Bio { get; set; } = string.Empty;
    }

    /// <summary>
    /// Handles the profile update command by modifying the user's profile in the database.
    /// </summary>
    /// <param name="context">The database context used to persist changes.</param>
    /// <param name="userAccessor">Service used to retrieve the currently authenticated user.</param>
    public class Handler(AppDbContext context, IUserAccessor userAccessor)
        : IRequestHandler<Command, Result<Unit>>
    {
        /// <summary>
        /// Updates the authenticated user's profile with the provided display name and bio.
        /// </summary>
        /// <param name="request">The command containing the updated profile information.</param>
        /// <param name="cancellationToken">A cancellation token for the asynchronous operation.</param>
        /// <returns>
        /// A <see cref="Result{T}"/> indicating success or failure of the update.
        /// </returns>
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserAsync();

            user.DisplayName = request.DisplayName;
            user.Bio = request.Bio;

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Failed to update profile", 400);
        }
    }
}
