using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

/// <summary>
/// A Data Transfer Object for changing a user's password.
/// </summary>
public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; } = "";

    [Required]
    public string NewPassword { get; set; } = "";
}
