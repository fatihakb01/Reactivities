using System;
using Application.Profiles.Command;
using Application.Profiles.Queries;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller for managing user profiles, including profile data and photo operations.
/// </summary>
public class ProfilesController : BaseApiController
{
    /// <summary>
    /// Uploads a new photo for the currently authenticated user.
    /// </summary>
    /// <param name="file">The image file to upload.</param>
    /// <returns>The uploaded <see cref="Photo"/> object.</returns>
    [HttpPost("add-photo")]
    public async Task<ActionResult<Photo>> AddPhoto(IFormFile file)
    {
        return HandleResult(await Mediator.Send(new AddPhoto.Command { File = file }));
    }

    /// <summary>
    /// Retrieves all photos for a specific user.
    /// </summary>
    /// <param name="userId">The ID of the user whose photos are to be fetched.</param>
    /// <returns>A list of <see cref="Photo"/> objects belonging to the user.</returns>
    [HttpGet("{userId}/photos")]
    public async Task<ActionResult<List<Photo>>> GetPhotosForUser(string userId)
    {
        return HandleResult(await Mediator.Send(new GetProfilePhotos.Query { UserId = userId }));
    }

    /// <summary>
    /// Deletes a photo by its ID.
    /// </summary>
    /// <param name="photoId">The ID of the photo to delete.</param>
    /// <returns>An HTTP 204 response if successful, or an appropriate error.</returns>
    [HttpDelete("{photoId}/photos")]
    public async Task<ActionResult> DeletePhoto(string photoId)
    {
        return HandleResult(await Mediator.Send(new DeletePhoto.Command { PhotoId = photoId }));
    }

    /// <summary>
    /// Sets a specific photo as the main profile photo.
    /// </summary>
    /// <param name="photoId">The ID of the photo to be set as main.</param>
    /// <returns>An HTTP 204 response if successful, or an appropriate error.</returns>
    [HttpPut("{photoId}/SetMain")]
    public async Task<ActionResult> SetMainPhoto(string photoId)
    {
        return HandleResult(await Mediator.Send(new SetMainPhoto.Command { PhotoId = photoId }));
    }

    /// <summary>
    /// Retrieves a full user profile, including bio and photo information.
    /// </summary>
    /// <param name="userId">The ID of the user whose profile is being requested.</param>
    /// <returns>A <see cref="UserProfile"/> DTO representing the user’s profile data.</returns>
    [HttpGet("{userId}")]
    public async Task<ActionResult<List<Photo>>> GetProfile(string userId)
    {
        return HandleResult(await Mediator.Send(new GetProfile.Query { UserId = userId }));
    }

    /// <summary>
    /// Updates the display name and biography of the currently authenticated user.
    /// </summary>
    /// <param name="command">
    /// A <see cref="EditProfile.Command"/> containing the updated display name and biography.
    /// </param>
    /// <returns>
    /// An HTTP 200 OK status if the update succeeds, or an error response if it fails.
    /// </returns>
    [HttpPut]
    public async Task<ActionResult> UpdateProfile(EditProfile.Command command)
    {
        return HandleResult(await Mediator.Send(command));
    }

    /// <summary>
    /// Toggles the following status for the specified user.
    /// </summary>
    /// <param name="userId">The ID of the user to follow or unfollow.</param>
    /// <returns>An <see cref="ActionResult"/> containing the operation result.</returns>
    [HttpPost("{userId}/follow")]
    public async Task<ActionResult> FollowToggle(string userId)
    {
        return HandleResult(await Mediator.Send(new FollowToggle.Command { TargetUserId = userId }));
    }

    /// <summary>
    /// Retrieves the follow list (followers or followings) for a specified user.
    /// </summary>
    /// <param name="userId">The ID of the user whose follow list is being retrieved.</param>
    /// <param name="predicate">
    /// Determines which list to retrieve: 
    /// "followers" for users following the specified user,  
    /// "followings" for users the specified user is following.
    /// </param>
    /// <returns>An <see cref="ActionResult"/> containing a list of <see cref="UserProfile"/> objects.</returns>
    [HttpGet("{userId}/follow-list")]
    public async Task<ActionResult> GetFollowings(string userId, string predicate)
    {
        return HandleResult(await Mediator.Send(new GetFollowings.Query { UserId = userId, Predicate = predicate }));
    }
}
