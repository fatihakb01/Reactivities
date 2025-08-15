using System;
using System.Diagnostics;
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
/// Handles retrieval of a paginated and optionally filtered list of activities.
/// </summary>
public class GetActivityList
{
    private const int MaxPageSize = 50;

    /// <summary>
    /// Represents the query to retrieve a paginated list of activities.
    /// </summary>
    public class Query : IRequest<Result<PagedList<ActivityDto, DateTime?>>>
    {
        /// <summary>
        /// The parameters used for filtering, pagination, and date range selection.
        /// </summary>
        public required ActivityParams Params { get; set; }
    }
    
    /// <summary>
    /// Handles execution of the <see cref="Query"/> to retrieve activity data from the database.
    /// </summary>
    /// <remarks>
    /// Supports filtering by:
    /// <list type="bullet">
    /// <item><description><c>isGoing</c> - Activities the current user is attending.</description></item>
    /// <item><description><c>isHost</c> - Activities the current user is hosting.</description></item>
    /// </list>
    /// Uses cursor-based pagination ordered by activity date.
    /// </remarks>
    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Query, Result<PagedList<ActivityDto, DateTime?>>>
    {

        public async Task<Result<PagedList<ActivityDto, DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.Activities
                .OrderBy(x => x.Date)
                .Where(x => x.Date >= (request.Params.Cursor ?? request.Params.StartDate))
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.Params.Filter))
            {
                query = request.Params.Filter switch
                {
                    "isGoing" => query.Where(x =>
                        x.Attendees.Any(a => a.UserId == userAccessor.GetUserId())),
                    "isHost" => query.Where(x =>
                        x.Attendees.Any(a => a.IsHost && a.UserId == userAccessor.GetUserId())),
                    _ => query
                };
            }

            var projectedActivities = query.ProjectTo<ActivityDto>(mapper.ConfigurationProvider,
                    new { currentUserId = userAccessor.GetUserId() });

            var activities = await projectedActivities
                .Take(request.Params.PageSize + 1)
                .ToListAsync(cancellationToken);

            DateTime? nextCursor = null;

            if (activities.Count > request.Params.PageSize)
            {
                nextCursor = activities.Last().Date;
                activities.RemoveAt(activities.Count - 1);
            }

            return Result<PagedList<ActivityDto, DateTime?>>.Success(
                new PagedList<ActivityDto, DateTime?>
                {
                    Items = activities,
                    NextCursor = nextCursor
                }
            );
        }
    }
}
