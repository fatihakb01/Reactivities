using System;
using Application.Activities.DTO;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Persistence;

namespace Application.Activities.Queries;

/// <summary>
/// Query handler for retrieving comments associated with a specific activity.
/// </summary>
public class GetComments
{
    /// <summary>
    /// Represents the query to retrieve all comments for an activity.
    /// </summary>
    public class Query : IRequest<Result<List<CommentDto>>>
    {
        /// <summary>
        /// Gets or sets the unique identifier of the activity whose comments will be retrieved.
        /// </summary>
        public required string ActivityId { get; set; }
    }

    /// <summary>
    /// Handles the <see cref="Query"/> for retrieving activity comments.
    /// </summary>
    /// <param name="context">The database context.</param>
    /// <param name="mapper">The AutoMapper instance for mapping to DTOs.</param>
    public class Handler(AppDbContext context, IMapper mapper)
        : IRequestHandler<Query, Result<List<CommentDto>>>
    {
        public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var comments = await context.Comments
                .Where(x => x.ActivityId == request.ActivityId)
                .OrderByDescending(x => x.CreatedAt)
                .ProjectTo<CommentDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            return Result<List<CommentDto>>.Success(comments);
        }
    }
}
