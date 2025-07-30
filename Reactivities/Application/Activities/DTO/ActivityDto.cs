using System;
using Application.Profiles.DTOs;

namespace Application.Activities.DTO;

/// <summary>
/// Represents the data transfer object for an activity exposed to the client.
/// </summary>
public class ActivityDto
{
    /// <summary>
    /// Unique identifier for the activity.
    /// </summary>
    public required string Id { get; set; }

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

    /// <summary>
    /// Display name of the user who is hosting the activity.
    /// </summary>
    public required string HostDisplayName { get; set; }

    /// <summary>
    /// Unique identifier of the host user.
    /// </summary>
    public required string HostId { get; set; }

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
    /// A collection of users attending the activity.
    /// </summary>
    public ICollection<UserProfile> Attendees { get; set; } = [];
}
