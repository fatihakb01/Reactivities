using System;
using Application.Activities.Commands;
using Application.Activities.Queries;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

/// <summary>
/// SignalR hub responsible for handling real-time comment functionality
/// for activities, including sending and loading comments.
/// </summary>
/// <param name="mediator">The mediator instance used to send application commands and queries.</param>
public class CommentHub(IMediator mediator) : Hub
{
    /// <summary>
    /// Sends a new comment to the specified activity and broadcasts it to all users in the group.
    /// </summary>
    /// <param name="command">The command containing the comment data to add.</param>    
    public async Task SendComment(AddComment.Command command)
    {
        var comment = await mediator.Send(command);

        await Clients.Group(command.ActivityId).SendAsync("RecieveComment", comment.Value);
    }

    /// <summary>
    /// Called when a client connects to the hub.
    /// Adds the client to the activity's comment group and loads existing comments.
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var activityId = httpContext?.Request.Query["activityId"];

        if (string.IsNullOrEmpty(activityId)) throw new HubException("No activity with this id");

        await Groups.AddToGroupAsync(Context.ConnectionId, activityId!);

        var result = await mediator.Send(new GetComments.Query { ActivityId = activityId! });

        await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
}
