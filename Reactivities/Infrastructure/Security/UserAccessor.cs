using System;
using System.Security.Claims;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security;

/// <summary>
/// Provides access to the currently authenticated user via HTTP context.
/// </summary>
/// <param name="httpContextAccessor">Provides access to the HTTP context.</param>
/// <param name="dbContext">Database context used to query user data.</param>
public class UserAccessor(IHttpContextAccessor httpContextAccessor, AppDbContext dbContext)
    : IUserAccessor
{
    /// <summary>
    /// Retrieves the currently authenticated <see cref="User"/> from the database.
    /// </summary>
    /// <returns>The current <see cref="User"/> object.</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown if no user is logged in.</exception>
    public async Task<User> GetUserAsync()
    {
        return await dbContext.Users.FindAsync(GetUserId())
            ?? throw new UnauthorizedAccessException("No user is logged in");
    }

    /// <summary>
    /// Gets the user ID of the current HTTP context user.
    /// </summary>
    /// <returns>The user's unique identifier.</returns>
    /// <exception cref="Exception">Thrown if no user is found in the context.</exception>
    public string GetUserId()
    {
        return httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new Exception("No user found");
    }
}
