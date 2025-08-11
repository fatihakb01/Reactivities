using System;
using Application.Activities.DTO;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
    public class Query : IRequest<Result<ActivityDto>>
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
    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, Result<ActivityDto>>
    {
        /// <summary>
        /// Handles the query and retrieves the specified activity.
        /// </summary>
        /// <param name="request">The query containing the activity ID.</param>
        /// <param name="cancellationToken">A token to cancel the operation.</param>
        /// <returns>A result object containing the activity or an error.</returns>
        public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
                .ProjectTo<ActivityDto>(mapper.ConfigurationProvider,
                    new { currentUserId = userAccessor.GetUserId() })
                .FirstOrDefaultAsync(x => request.Id == x.Id, cancellationToken);

            if (activity == null) return Result<ActivityDto>.Failure("Activity not found", 404);

            return Result<ActivityDto>.Success(activity);
        }
    }
}
