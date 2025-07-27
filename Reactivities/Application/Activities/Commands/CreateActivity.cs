using System;
using Application.Activities.DTO;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

/// <summary>
/// Command and handler for creating a new activity.
/// </summary>
public class CreateActivity
{
    /// <summary>
    /// Command containing the data needed to create a new activity.
    /// </summary>
    public class Command : IRequest<Result<string>>
    {
        /// <summary>
        /// The DTO containing activity details.
        /// </summary>
        public required CreateActivityDto ActivityDto { get; set; }
    }

    /// <summary>
    /// Handles the creation of a new activity and persists it to the database.
    /// </summary>
    /// <param name="context">The database context used for persistence.</param>
    /// <param name="mapper">AutoMapper instance for mapping DTO to entity.</param>
    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
    {
        /// <summary>
        /// Handles the command to create a new activity.
        /// </summary>
        /// <param name="request">The create activity command.</param>
        /// <param name="cancellationToken">Cancellation token for async operation.</param>
        /// <returns>
        /// A result indicating success or failure, with the created activity's ID on success.
        /// </returns>
        public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = mapper.Map<Activity>(request.ActivityDto);

            context.Activities.Add(activity);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<string>.Failure("Failed to create the activity", 400);

            return Result<string>.Success(activity.Id);
        }
    }
}
