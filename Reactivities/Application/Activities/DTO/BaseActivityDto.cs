using System;

namespace Application.Activities.DTO;

/// <summary>
/// Base class containing common activity properties used for creation and updates.
/// Includes fields such as title, date, description, and location.
/// </summary>
public class BaseActivityDto
{
    public string Title { get; set; } = "";
    public DateTime Date { get; set; }
    public string Description { get; set; } = "";
    public string Category { get; set; } = "";
    public string City { get; set; } = "";
    public string Venue { get; set; } = "";
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
