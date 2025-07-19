using System;
using Application.Activities.Commands;
using Application.Activities.DTO;
using Application.Activities.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// API controller responsible for handling HTTP requests related to activities.
/// Supports CRUD operations (Create, Read, Update, Delete).
/// Inherits shared logic from BaseApiController, including access to the Mediator and result handling.
/// </summary>
public class ActivitiesController : BaseApiController
{
    /// <summary>
    /// Retrieves a list of all activities from the system.
    /// </summary>
    /// <returns>A list of <see cref="Activity"/> objects.</returns>
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return await Mediator.Send(new GetActivityList.Query());
    }

    /// <summary>
    /// Retrieves a specific activity by its unique ID.
    /// </summary>
    /// <param name="id">The ID of the activity to retrieve.</param>
    /// <returns>The requested <see cref="Activity"/> if found; otherwise, an appropriate HTTP status.</returns>
    [HttpGet("{Id}")]
    public async Task<ActionResult<Activity>> GetActivityDetail(string id)
    {
        return HandleResult(await Mediator.Send(new GetActivityDetails.Query { Id = id }));
    }

    /// <summary>
    /// Creates a new activity using the provided data transfer object.
    /// </summary>
    /// <param name="activityDto">The data used to create the new activity.</param>
    /// <returns>A result containing the outcome of the creation operation.</returns>
    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity(CreateActivityDto activityDto)
    {
        return HandleResult(await Mediator.Send(new CreateActivity.Command { ActivityDto = activityDto }));
    }

    /// <summary>
    /// Updates an existing activity using the provided data.
    /// </summary>
    /// <param name="activity">The updated activity data.</param>
    /// <returns>Returns HTTP 204 No Content on success.</returns>
    [HttpPut]
    public async Task<ActionResult> EditActivity(EditActivityDto activity)
    {
        await Mediator.Send(new EditActivity.Command { ActivityDto = activity });

        return NoContent();
    }

    /// <summary>
    /// Deletes an activity based on the provided ID.
    /// </summary>
    /// <param name="id">The ID of the activity to delete.</param>
    /// <returns>A result indicating whether the deletion was successful.</returns>
    [HttpDelete("{Id}")]
    public async Task<ActionResult> DeleteActivity(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteActivity.Command { Id = id }));
    }
}
