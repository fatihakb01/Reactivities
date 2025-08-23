using System;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

/// <summary>
/// Command for updating attendance for a given activity.
/// Allows a user to join or leave an activity or toggle cancellation if the user is the host.
/// </summary>
public class UpdateAttendance
{
    /// <summary>
    /// The command request containing the activity ID.
    /// </summary>
    public class Command : IRequest<Result<Unit>>
    {
        /// <summary>
        /// The ID of the activity to update attendance for.
        /// </summary>
        public required string Id { get; set; }
    }

    /// <summary>
    /// Handles the <see cref="Command"/> for updating the attendance state of a user for a specific activity.
    /// </summary>
    /// <param name="userAccessor">Provides the current user information.</param>
    /// <param name="context">The application's database context.</param>
    public class Handler(IUserAccessor userAccessor, AppDbContext context)
    : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
                .Include(x => x.Attendees)
                .ThenInclude(x => x.User)
                .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (activity == null) return Result<Unit>.Failure("Activity not found", 404);

            var user = await userAccessor.GetUserAsync();

            var attendance = activity.Attendees.FirstOrDefault(x => x.UserId == user.Id);
            var isHost = activity.Attendees.Any(x => x.IsHost && x.UserId == user.Id);

            if (attendance != null)
            {
                if (isHost) activity.IsCancelled = !activity.IsCancelled;
                else activity.Attendees.Remove(attendance);
            }
            else
            {
                activity.Attendees.Add(new Domain.ActivityAttendee
                {
                    UserId = user.Id,
                    ActivityId = activity.Id,
                    IsHost = false
                });
            }

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem updating the DB", 400);
        }
    }
}
