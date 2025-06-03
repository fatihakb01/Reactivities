using System;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class ActivitiesController(AppDbContext context) : BaseApiController
{
    // Return activities
    // test using https://localhost:5001/api/activities
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return await context.Activities.ToListAsync();
    }

    // Return a specific activity based on id
    // test using https://localhost:5001/api/activities/{id}
    // e.g. https://localhost:5001/api/activities/0f6fc368-88c2-4b74-aa24-01b9a97f1de0
    [HttpGet("{Id}")]
    public async Task<ActionResult<Activity>> GetActivityDetail(string id)
    {
        var activity = await context.Activities.FindAsync(id);

        if (activity == null) return NotFound();

        return activity;
    }
    //// Old fashion way (instead of public class ActivitiesController(AppDbContext context))
    // private readonly AppDbContext context;

    // public ActivitiesController(AppDbContext context)
    // {
    //     this.context = context;
    // }
}
