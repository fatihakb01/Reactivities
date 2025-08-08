 using System;
using Application.Profiles.Command;
 using FluentValidation;
 namespace Application.Profiles.Validators;
 
 /// <summary>
/// Validator for the <see cref="EditProfile.Command"/> class.
/// Ensures that required fields meet the defined constraints.
/// </summary>
 public class EditProfileValidator : AbstractValidator<EditProfile.Command>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="EditProfileValidator"/> class.
    /// Adds validation rules for the edit profile command.
    /// </summary>
    public EditProfileValidator()
    {
        RuleFor(x => x.DisplayName).NotEmpty();
    }
}
