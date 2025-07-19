using System;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities.Queries;

/// <summary>
/// Retrieves a list of all activities.
/// </summary>
public class GetActivityList
{
    /// <summary>
    /// Query object used to request a list of activities.
    /// </summary>
    public class Query : IRequest<List<Activity>> { }

    /// <summary>
    /// Handler for processing the GetActivityList query.
    /// </summary>
    /// <param name="context">The application's database context.</param>
    public class Handler(AppDbContext context) : IRequestHandler<Query, List<Activity>>
    {
        /// <summary>
        /// Handles the query and retrieves all activities from the database.
        /// </summary>
        /// <param name="request">The query request (unused in this case).</param>
        /// <param name="cancellationToken">A token to cancel the operation.</param>
        /// <returns>A list of all activities.</returns>
        public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Activities.ToListAsync(cancellationToken);
        }
    }
}
