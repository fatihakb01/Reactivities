using System;

namespace Domain;

/// <summary>
/// Represents a following relationship between two users.
/// </summary>
public class UserFollowing
{
    public required string ObserverId { get; set; }
    public User Observer { get; set; } = null!; // Follower
    public required string TargetId { get; set; }
    public User Target { get; set; } = null!; // Folowee
}
