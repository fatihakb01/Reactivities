using System;

namespace Application.Activities.DTO;

/// <summary>
/// Data Transfer Object used to edit an existing activity.
/// Inherits from <see cref="BaseActivityDto"/> and includes the required activity ID.
/// </summary>
public class EditActivityDto : BaseActivityDto
{
    /// <summary>
    /// The unique identifier of the activity to be edited.
    /// </summary>
    public string Id { get; set; } = "";
}
