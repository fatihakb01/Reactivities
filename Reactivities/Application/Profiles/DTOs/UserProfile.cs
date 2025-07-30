using System;

namespace Application.Profiles.DTOs;

/// <summary>
/// Represents a basic profile of a user participating in activities.
/// </summary>
public class UserProfile
{
    /// <summary>
    /// Unique identifier of the user.
    /// </summary>
    public required string Id { get; set; }

    /// <summary>
    /// Display name of the user.
    /// </summary>
    public required string DisplayName { get; set; }

    /// <summary>
    /// Short biography or description about the user.
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// URL of the user's profile image.
    /// </summary>
    public string? ImageUrl { get; set; }
}
