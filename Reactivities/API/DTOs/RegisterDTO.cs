using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

/// <summary>
/// Data transfer object containing the information required to register a new user.
/// </summary>
public class RegisterDTO
{
    [Required]
    public string DisplayName { get; set; } = "";

    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    public string Password { get; set; } = "";
}
