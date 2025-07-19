using System;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Queries;

/// <summary>
/// Retrieves the details of a specific activity by ID.
/// </summary>
public class GetActivityDetails
{
    /// <summary>
    /// Query object containing the ID of the activity to retrieve.
    /// </summary>
    public class Query : IRequest<Result<Activity>>
    {
        /// <summary>
        /// The ID of the activity to fetch.
        /// </summary>
        public required string Id { get; set; }
    }

    /// <summary>
    /// Handler for processing the GetActivityDetails query.
    /// </summary>
    /// <param name="context">The application's database context.</param>
    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<Activity>>
    {
        /// <summary>
        /// Handles the query and retrieves the specified activity.
        /// </summary>
        /// <param name="request">The query containing the activity ID.</param>
        /// <param name="cancellationToken">A token to cancel the operation.</param>
        /// <returns>A result object containing the activity or an error.</returns>
        public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync([request.Id], cancellationToken);

            if (activity == null) return Result<Activity>.Failure("Activity not found", 404);

            return Result<Activity>.Success(activity);
        }
    }
}
