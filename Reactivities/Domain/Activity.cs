using System;

namespace Domain;

/// <summary>
/// Represents the Activity domain model.
/// </summary>
public class Activity
{
    /// <summary>
    /// Unique identifier for the activity.
    /// </summary>
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Title of the activity.
    /// </summary>
    public required string Title { get; set; }

    /// <summary>
    /// Scheduled date and time of the activity.
    /// </summary>
    public DateTime Date { get; set; }

    /// <summary>
    /// Detailed description of the activity.
    /// </summary>
    public required string Description { get; set; }

    /// <summary>
    /// Category or type of the activity.
    /// </summary>
    public required string Category { get; set; }

    /// <summary>
    /// Indicates whether the activity has been cancelled.
    /// </summary>
    public bool IsCancelled { get; set; }

    // Location information

    /// <summary>
    /// City where the activity takes place.
    /// </summary>
    public required string City { get; set; }

    /// <summary>
    /// Specific venue of the activity.
    /// </summary>
    public required string Venue { get; set; }

    /// <summary>
    /// Latitude coordinate for the activity's location.
    /// </summary>
    public double Latitude { get; set; }

    /// <summary>
    /// Longitude coordinate for the activity's location.
    /// </summary>
    public double Longitude { get; set; }

    /// <summary>
    /// Navigation property for the related <see cref="Attendees"/>.
    /// </summary>
    public ICollection<ActivityAttendee> Attendees { get; set; } = [];

    /// <summary>
    /// Navigation property for the related <see cref="Comments"/>.
    /// </summary>
    public ICollection<Comment> Comments { get; set; } = [];
}
