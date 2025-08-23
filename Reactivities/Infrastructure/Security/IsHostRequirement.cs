using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

/// <summary>
/// An authorization requirement that checks if the current user is the host of a specific activity.
/// </summary>
public class IsHostRequirement : IAuthorizationRequirement
{
    // This class is empty because it only serves as a marker for the authorization policy.
}

/// <summary>
/// An authorization handler that checks if a user meets the <see cref="IsHostRequirement"/>.
/// </summary>
/// <param name="dbContext">The application's database context to query activity data.</param>
/// <param name="httpContextAccessor">The accessor for the current HTTP context to retrieve route values.</param>
public class IsHostRequirementHandler(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    : AuthorizationHandler<IsHostRequirement>
{
    /// <summary>
    /// Handles the authorization requirement by checking if the user is the host of the activity specified in the route.
    /// </summary>
    /// <param name="context">The authorization context.</param>
    /// <param name="requirement">The authorization requirement to handle.</param>
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return;

        var httpContext = httpContextAccessor.HttpContext;

        if (httpContext?.GetRouteValue("id") is not string activityId) return;

        var attendee = await dbContext.ActivityAttendees
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.UserId == userId && x.ActivityId == activityId);

        if (attendee == null) return;

        if (attendee.IsHost) context.Succeed(requirement);
    }
}
