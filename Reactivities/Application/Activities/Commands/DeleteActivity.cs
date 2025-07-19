using System;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

/// <summary>
/// Deletes a specific activity by ID.
/// </summary>
public class DeleteActivity
{
    /// <summary>
    /// Command object containing the ID of the activity to delete.
    /// </summary>
    public class Command : IRequest<Result<Unit>>
    {
        /// <summary>
        /// The ID of the activity to delete.
        /// </summary>
        public required string Id { get; set; }
    }

    /// <summary>
    /// Handler for processing the DeleteActivity command.
    /// </summary>
    /// <param name="context">The application's database context.</param>
    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        /// <summary>
        /// Handles the command and deletes the specified activity from the database.
        /// </summary>
        /// <param name="request">The command containing the activity ID.</param>
        /// <param name="cancellationToken">A token to cancel the operation.</param>
        /// <returns>A result indicating success or failure of the operation.</returns>
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync([request.Id], cancellationToken);

            if (activity == null) return Result<Unit>.Failure("Activity not found", 404);

            context.Remove(activity);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to delete the activity", 400);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
