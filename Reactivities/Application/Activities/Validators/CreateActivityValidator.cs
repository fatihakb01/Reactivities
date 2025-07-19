using System;
using Application.Activities.Commands;
using Application.Activities.DTO;
using FluentValidation;

namespace Application.Activities.Validators;

/// <summary>
/// Validator for creating an activity. Uses base activity validation rules.
/// </summary>
public class CreateActivityValidator : BaseActivityValidator<CreateActivity.Command, CreateActivityDto>
{
    /// <summary>
    /// Initializes rules for creating an activity. No additional rules beyond base validator.
    /// </summary>
    public CreateActivityValidator() : base(x => x.ActivityDto)
    {

    }
}
