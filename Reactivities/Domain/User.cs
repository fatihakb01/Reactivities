using System;
using Microsoft.AspNetCore.Identity;

namespace Domain;

/// <summary>
/// Represents an application user that extends the default ASP.NET Core IdentityUser.
/// Additional properties such as DisplayName, Bio, and ImageUrl are included.
/// </summary>
public class User : IdentityUser
{
    /// <summary>
    /// The display name shown to other users.
    /// </summary>
    public string? DisplayName { get; set; }

    /// <summary>
    /// A short biography or description about the user.
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// A URL pointing to the user's profile image.
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Navigation property for the related <see cref="Activities"/>.
    /// </summary>
    public ICollection<ActivityAttendee> Activities { get; set; } = [];

    /// <summary>
    /// Navigation property for the related <see cref="Photos"/>.
    /// </summary>
    public ICollection<Photo> Photos { get; set; } = [];
}
