using System;
using Application.Activities.DTO;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

/// <summary>
/// Command to edit an existing activity using a DTO.
/// </summary>
public class EditActivity
{
    /// <summary>
    /// Command class that contains the activity data to be edited.
    /// </summary>
    public class Command : IRequest<Result<Unit>>
    {
        /// <summary>
        /// The DTO containing the updated activity data.
        /// </summary>
        public required EditActivityDto ActivityDto { get; set; }
    }

    /// <summary>
    /// Handler for processing the EditActivity command.
    /// </summary>
    /// <param name="context">Database context used to access the activity entity.</param>
    /// <param name="mapper">AutoMapper instance to apply changes from DTO to entity.</param>
    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
        /// <summary>
        /// Handles the editing of an activity.
        /// </summary>
        /// <param name="request">The command containing updated data.</param>
        /// <param name="cancellationToken">Token to cancel the async operation.</param>
        /// <returns>A result indicating success or failure.</returns>
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync([request.ActivityDto.Id], cancellationToken);

            if (activity == null) return Result<Unit>.Failure("Activity not found", 404);

            mapper.Map(request.ActivityDto, activity);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to update the activity", 400);

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
