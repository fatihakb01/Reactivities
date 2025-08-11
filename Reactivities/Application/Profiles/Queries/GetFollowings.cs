using System;
using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

/// <summary>
/// Retrieves the list of followers or followings for a given user.
/// </summary>
public class GetFollowings
{
    /// <summary>
    /// Query object containing the target user ID and the type of follow list to retrieve.
    /// </summary>
    public class Query : IRequest<Result<List<UserProfile>>>
    {
        /// <summary>
        /// The follow list type to retrieve.  
        /// Use "followers" to retrieve users following the target user,  
        /// or "followings" to retrieve users the target user is following.
        /// </summary>
        public string Predicate { get; set; } = "followers";

        /// <summary>
        /// The ID of the user whose follow list is being retrieved.
        /// </summary>
        public required string UserId { get; set; }
    }

    /// <summary>
    /// Handles the retrieval of follow lists from the database.
    /// </summary>
    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Query, Result<List<UserProfile>>>
    {
        public async Task<Result<List<UserProfile>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profiles = new List<UserProfile>();

            switch (request.Predicate)
            {
                case "followers":
                    profiles = await context.UserFollowings
                        .Where(x => x.TargetId == request.UserId)
                        .Select(x => x.Observer)
                        .ProjectTo<UserProfile>(mapper.ConfigurationProvider,
                            new { currentUserId = userAccessor.GetUserId() })
                        .ToListAsync(cancellationToken);
                    break;
                case "followings":
                    profiles = await context.UserFollowings
                        .Where(x => x.ObserverId == request.UserId)
                        .Select(x => x.Target)
                        .ProjectTo<UserProfile>(mapper.ConfigurationProvider,
                            new { currentUserId = userAccessor.GetUserId() })
                        .ToListAsync(cancellationToken);
                    break;
            }

            return Result<List<UserProfile>>.Success(profiles);
        }
    }
}
