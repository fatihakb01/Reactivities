using System;
using Application.Activities.Commands;
using Application.Activities.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    // Return activities
    // test using https://localhost:5001/api/activities
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return await Mediator.Send(new GetActivityList.Query());
    }

    // Return a specific activity based on id
    // test using https://localhost:5001/api/activities/{id}
    // e.g. https://localhost:5001/api/activities/0f6fc368-88c2-4b74-aa24-01b9a97f1de0
    [HttpGet("{Id}")]
    public async Task<ActionResult<Activity>> GetActivityDetail(string id)
    {
        return await Mediator.Send(new GetActivityDetails.Query { Id = id });
    }

    // Creating a new activity
    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity(Activity activity)
    {
        return await Mediator.Send(new CreateActivity.Command { Activity = activity });
    }

    // Changing an activity
    [HttpPut]
    public async Task<ActionResult> EditActivity(Activity activity)
    {
        await Mediator.Send(new EditActivity.Command { Activity = activity });

        return NoContent(); // we need this because EditActivity.Command does not return anything
    }

    // Delete an activity
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteActivity(string id)
    {
        await Mediator.Send(new DeleteActivity.Command { Id = id });

        return Ok(); // we need this because DeleteActivity.Command does not return anything
    } 
    
    //// Old fashion way (instead of public class ActivitiesController(AppDbContext context))
    // private readonly AppDbContext context;

    // public ActivitiesController(AppDbContext context)
    // {
    //     this.context = context;
    // }
}
