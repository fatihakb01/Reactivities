using System;
using Domain;

namespace Application.Interfaces;

/// <summary>
/// Provides access to the currently authenticated user and their identity.
/// </summary>
public interface IUserAccessor
{
    /// <summary>
    /// Retrieves the unique identifier of the currently authenticated user.
    /// </summary>
    /// <returns>A string representing the user's ID.</returns>
    string GetUserId();

    /// <summary>
    /// Retrieves the full <see cref="User"/> object of the currently authenticated user from the database.
    /// </summary>
    /// <returns>The current <see cref="User"/>.</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown when no user is authenticated.</exception>
    Task<User> GetUserAsync();
}
