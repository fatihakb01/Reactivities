using System;
using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller responsible for user account-related actions such as registration,
/// retrieving user info, and logging out.
/// </summary>
public class AccountController(SignInManager<User> signInManager) : BaseApiController
{

    /// <summary>
    /// Registers a new user with the provided registration details.
    /// </summary>
    /// <param name="registerDTO">The data transfer object containing the user's registration info such as email, display name, and password.</param>
    /// <returns>
    /// Returns <see cref="OkResult"/> if the user was successfully created.
    /// Returns a validation problem response if there are errors during creation.
    /// </returns>
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegisterDTO registerDTO)
    {
        var user = new User()
        {
            UserName = registerDTO.Email,
            Email = registerDTO.Email,
            DisplayName = registerDTO.DisplayName
        };

        var result = await signInManager.UserManager.CreateAsync(user, registerDTO.Password);

        if (result.Succeeded) return Ok();

        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(error.Code, error.Description);
        }

        return ValidationProblem();
    }

    /// <summary>
    /// Retrieves the currently logged-in user's information.
    /// </summary>
    /// <returns>
    /// Returns <see cref="NoContentResult"/> if the user is not authenticated.
    /// Returns <see cref="UnauthorizedResult"/> if the user object could not be retrieved.
    /// Otherwise, returns <see cref="OkObjectResult"/> with the user's display name, email, ID, and image URL.
    /// </returns>
    [AllowAnonymous]
    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated == false) return NoContent();

        var user = await signInManager.UserManager.GetUserAsync(User);

        if (user == null) return Unauthorized();

        return Ok(new
        {
            user.DisplayName,
            user.Email,
            user.Id,
            user.ImageUrl
        });
    }

    /// <summary>
    /// Logs out the currently authenticated user.
    /// </summary>
    /// <returns>
    /// Returns <see cref="NoContentResult"/> after the sign-out operation completes.
    /// </returns>
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();

        return NoContent();
    }
}
