using System;

namespace Application.Activities.DTO;

// Specify the properties we need in order to create an activity
// This is used for validation on the required fields
// [Required] is an example of data annotation
// Validation is handled by API Controller in this case
public class BaseActivityDto
{
    // [Required]
    public string Title { get; set; } = "";
    // [Required]
    public DateTime Date { get; set; }
    // [Required]
    public string Description { get; set; } = "";
    // [Required]
    public string Category { get; set; } = "";

    // location groups
    // [Required]
    public string City { get; set; } = "";
    // [Required]
    public string Venue { get; set; } = "";
    // [Required]
    public double Latitude { get; set; }
    // [Required]
    public double Longitude { get; set; }
}
