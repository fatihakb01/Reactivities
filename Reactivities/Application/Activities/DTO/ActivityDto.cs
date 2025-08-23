using System;
using Application.Profiles.DTOs;

namespace Application.Activities.DTO;

/// <summary>
/// Represents the data transfer object for an activity exposed to the client.
/// </summary>
public class ActivityDto
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public DateTime Date { get; set; }
    public required string Description { get; set; }
    public required string Category { get; set; }
    public bool IsCancelled { get; set; }
    public required string HostDisplayName { get; set; }
    public required string HostId { get; set; }

    // Location information
    public required string City { get; set; }
    public required string Venue { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    /// A collection of users attending the activity.
    public ICollection<UserProfile> Attendees { get; set; } = [];
}
