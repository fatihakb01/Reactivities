using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

/// <summary>
/// Data transfer object containing the information required to register a new user.
/// </summary>
public class RegisterDTO
{
    /// <summary>
    /// The display name chosen by the user. This field is required.
    /// </summary>
    [Required]
    public string DisplayName { get; set; } = "";

    /// <summary>
    /// The user's email address, which will also be used as the username. This field is required and must be a valid email format.
    /// </summary>
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    /// <summary>
    /// The password for the new account.
    /// </summary>
    public string Password { get; set; } = "";
}
