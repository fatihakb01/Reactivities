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
/// Query handler for retrieving a full user profile, including photo and bio information.
/// </summary>
public class GetProfile
{
    /// <summary>
    /// Request object containing the user ID whose profile is to be fetched.
    /// </summary>
    public class Query : IRequest<Result<UserProfile>>
    {
        /// <summary>
        /// The unique identifier of the user.
        /// </summary>
        public required string UserId { get; set; }
    }

    /// <summary>
    /// Handles the <see cref="Query"/> by mapping the user entity to a <see cref="UserProfile"/> DTO.
    /// </summary>
    /// <param name="context">The application database context.</param>
    /// <param name="mapper">The AutoMapper instance used for projection.</param>
    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Query, Result<UserProfile>>
    {
        public async Task<Result<UserProfile>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profile = await context.Users
                .ProjectTo<UserProfile>(mapper.ConfigurationProvider,
                    new { currentUserId = userAccessor.GetUserId() })
                .SingleOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);

            return profile == null
                ? Result<UserProfile>.Failure("Profile not found", 404)
                : Result<UserProfile>.Success(profile);
        }
    }
}
