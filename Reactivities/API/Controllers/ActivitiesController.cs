using System;
using Application.Activities.Commands;
using Application.Activities.DTO;
using Application.Activities.Queries;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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
    /// Retrieves a paginated list of activities based on provided query parameters.
    /// </summary>
    /// <param name="activityParams">
    /// The query parameters used for filtering, sorting, and pagination, 
    /// including filter type, start date, cursor position, and page size.
    /// </param>
    /// <returns>
    /// A paged list of <see cref="ActivityDto"/> objects along with an optional next cursor for pagination.
    /// </returns>
    /// <remarks>
    /// This endpoint supports infinite scrolling style pagination using a cursor.
    /// </remarks>
    [HttpGet]
    public async Task<ActionResult<PagedList<ActivityDto, DateTime?>>> GetActivities(
        [FromQuery] ActivityParams activityParams)
    {
        return HandleResult(await Mediator.Send(new GetActivityList.Query {Params = activityParams}));
    }

    /// <summary>
    /// Retrieves a specific activity by its unique ID.
    /// </summary>
    /// <param name="id">The ID of the activity to retrieve.</param>
    /// <returns>The requested <see cref="Activity"/> if found; otherwise, an appropriate HTTP status.</returns>
    [HttpGet("{Id}")]
    public async Task<ActionResult<ActivityDto>> GetActivityDetail(string id)
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
    [HttpPut("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult> EditActivity(string id, EditActivityDto activity)
    {
        activity.Id = id;
        return HandleResult(await Mediator.Send(new EditActivity.Command { ActivityDto = activity }));
    }

    /// <summary>
    /// Deletes an activity based on the provided ID.
    /// </summary>
    /// <param name="id">The ID of the activity to delete.</param>
    /// <returns>A result indicating whether the deletion was successful.</returns>
    [HttpDelete("{Id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult> DeleteActivity(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteActivity.Command { Id = id }));
    }

    /// <summary>
    /// Toggles the current user's attendance for the specified activity.
    /// If the user is not attending, they are added. If they are already attending, they are removed.
    /// If the user is the host, this action toggles the activity's cancellation status.
    /// </summary>
    /// <param name="id">The ID of the activity to attend or leave.</param>
    /// <returns>A result indicating whether the attendance was successfully updated.</returns>
    [HttpPost("{id}/attend")]
    public async Task<ActionResult> Attend(string id)
    {
        return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
    }
}
