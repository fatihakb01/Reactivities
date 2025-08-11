using System;
using Microsoft.AspNetCore.Identity;

namespace Domain;

/// <summary>
/// Represents an application user that extends the default ASP.NET Core IdentityUser.
/// Additional properties such as DisplayName, Bio, and ImageUrl are included.
/// </summary>
public class User : IdentityUser
{
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }

    // Navigation properties
    public ICollection<ActivityAttendee> Activities { get; set; } = [];
    public ICollection<Photo> Photos { get; set; } = [];
    public ICollection<UserFollowing> Followings { get; set; } = [];
    public ICollection<UserFollowing> Followers { get; set; } = [];
}
