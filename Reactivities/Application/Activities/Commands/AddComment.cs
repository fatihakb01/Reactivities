using System;
using System.Diagnostics;
using Application.Activities.DTO;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

/// <summary>
/// Command handler for adding a new comment to an activity.
/// </summary>
public class AddComment
{
    /// <summary>
    /// Represents the command to add a comment to an activity.
    /// </summary>
    public class Command : IRequest<Result<CommentDto>>
    {
        /// <summary>
        /// Gets or sets the text content of the comment.
        /// </summary>
        public required string Body { get; set; }

        /// <summary>
        /// Gets or sets the unique identifier of the activity to which the comment belongs.
        /// </summary>
        public required string ActivityId { get; set; }
    }

    /// <summary>
    /// Handles the <see cref="Command"/> for adding a comment.
    /// </summary>
    /// <param name="context">The database context.</param>
    /// <param name="mapper">The AutoMapper instance for object mapping.</param>
    /// <param name="userAccessor">The user accessor to retrieve the current user.</param>
    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Command, Result<CommentDto>>
    {
        public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
                .Include(x => x.Comments)
                .ThenInclude(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == request.ActivityId, cancellationToken);

            if (activity == null) return Result<CommentDto>.Failure("Could not find activity", 404);

            var user = await userAccessor.GetUserAsync();

            var comment = new Comment
            {
                UserId = user.Id,
                ActivityId = activity.Id,
                Body = request.Body
            };

            activity.Comments.Add(comment);

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<CommentDto>.Success(mapper.Map<CommentDto>(comment))
                : Result<CommentDto>.Failure("Failed to add comment", 400);
        }
    }
}
