using System;

namespace Domain;

/// <summary>
/// Represents the relationship between a user and an activity they are attending.
/// </summary>
public class ActivityAttendee
{
    /// <summary>
    /// Foreign key referencing the user's ID.
    /// </summary>
    public string? UserId { get; set; }

    /// <summary>
    /// Navigation property for the related <see cref="User"/>.
    /// </summary>
    public User User { get; set; } = null!;

    /// <summary>
    /// Foreign key referencing the activity's ID.
    /// </summary>
    public string? ActivityId { get; set; }

    /// <summary>
    /// Navigation property for the related <see cref="Activity"/>.
    /// </summary>
    public Activity Activity { get; set; } = null!;

    /// <summary>
    /// Indicates whether the user is the host of the activity.
    /// </summary>
    public bool IsHost { get; set; }

    /// <summary>
    /// Date the user joined the activity.
    /// </summary>
    public DateTime DateJoined { get; set; } = DateTime.UtcNow;
}
