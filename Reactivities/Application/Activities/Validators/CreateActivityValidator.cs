using System;
using Application.Activities.Commands;
using Application.Activities.DTO;
using FluentValidation;

namespace Application.Activities.Validators;

// In order to let the application logic/mediator handle validation (instead of the APIController),
// we should use AbstractValidator from Fluent Validator (instead of the [Required] data annotation)
public class CreateActivityValidator : BaseActivityValidator<CreateActivity.Command, CreateActivityDto>
{
    public CreateActivityValidator() : base(x => x.ActivityDto)
    {
                                     
    }
}
