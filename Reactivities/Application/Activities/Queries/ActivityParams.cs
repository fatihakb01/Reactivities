using System;
using Application.Core;

namespace Application.Activities.Queries;

/// <summary>
/// Represents the parameters used for querying a paginated list of activities.
/// </summary>
public class ActivityParams : PaginationParams<DateTime?>
{
    public string? Filter { get; set; }
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
}
