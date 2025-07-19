using System;
using Application.Activities.Commands;
using Application.Activities.DTO;
using FluentValidation;

namespace Application.Activities.Validators;

/// <summary>
/// Validator for editing an activity. Inherits base activity validation rules and adds ID validation.
/// </summary>
public class EditActivityValidator : BaseActivityValidator<EditActivity.Command, EditActivityDto>
{
    /// <summary>
    /// Initializes rules specific to editing an activity.
    /// </summary>
    public EditActivityValidator() : base(x => x.ActivityDto)
    {
        RuleFor(x => x.ActivityDto.Id)
            .NotEmpty().WithMessage("Id is required");
    }
}
