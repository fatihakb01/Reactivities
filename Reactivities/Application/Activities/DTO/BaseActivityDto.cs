using System;

namespace Application.Activities.DTO;

/// <summary>
/// Base class containing common activity properties used for creation and updates.
/// Includes fields such as title, date, description, and location.
/// </summary>
public class BaseActivityDto
{
    /// <summary>
    /// The title of the activity.
    /// </summary>
    public string Title { get; set; } = "";

    /// <summary>
    /// The date and time when the activity takes place.
    /// </summary>
    public DateTime Date { get; set; }

    /// <summary>
    /// A textual description of the activity.
    /// </summary>
    public string Description { get; set; } = "";

    /// <summary>
    /// The category the activity belongs to (e.g., sports, music).
    /// </summary>
    public string Category { get; set; } = "";

    /// <summary>
    /// The city where the activity is held.
    /// </summary>
    public string City { get; set; } = "";

    /// <summary>
    /// The specific venue or location name.
    /// </summary>
    public string Venue { get; set; } = "";

    /// <summary>
    /// The geographical latitude of the activity venue.
    /// </summary>
    public double Latitude { get; set; }

    /// <summary>
    /// The geographical longitude of the activity venue.
    /// </summary>
    public double Longitude { get; set; }
}
