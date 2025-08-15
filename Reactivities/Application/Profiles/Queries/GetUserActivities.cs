using System;
using Application.Core;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

/// <summary>
/// Query for retrieving a list of user activities based on filter criteria.
/// </summary>
public class GetUserActivities
{
    /// <summary>
    /// Represents the request parameters for retrieving user activities.
    /// </summary>
    public class Query : IRequest<Result<List<UserActivityDto>>>
    {
        /// <summary>
        /// Gets or sets the unique identifier of the user.
        /// </summary>
        public required string UserId { get; set; }

        /// <summary>
        /// Gets or sets the filter applied to activities.
        /// Possible values: "past", "hosting", or default (future).
        /// </summary>
        public required string Filter { get; set; }
    }

    /// <summary>
    /// Handles the retrieval of user activities based on the provided filter and user ID.
    /// </summary>
    public class Handler(AppDbContext context, IMapper mapper)
    : IRequestHandler<Query, Result<List<UserActivityDto>>>
    {
        public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.ActivityAttendees
                .Where(u => u.User.Id == request.UserId)
                .OrderBy(a => a.Activity.Date)
                .Select(x => x.Activity)
                .AsQueryable();

            var today = DateTime.UtcNow;

            query = request.Filter switch
            {
                "past" => query.Where(a => a.Date <= today
                    && a.Attendees.Any(x => x.UserId == request.UserId)),
                "hosting" => query.Where(a => a.Attendees.Any(x => x.IsHost
                    && x.UserId == request.UserId)),
                _ => query.Where(a => a.Date >= today
                    && a.Attendees.Any(x => x.UserId == request.UserId))
            };

            var projectedActivities = query
                .ProjectTo<UserActivityDto>(mapper.ConfigurationProvider);

            var activities = await projectedActivities.ToListAsync(cancellationToken);

            return Result<List<UserActivityDto>>.Success(activities);

        }
    }
}
