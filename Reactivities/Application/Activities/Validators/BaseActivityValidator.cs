using System;
using Application.Activities.DTO;
using FluentValidation;

namespace Application.Activities.Validators;

/// <summary>
/// Generic base validator for activity DTOs, validating common fields.
/// </summary>
/// <typeparam name="T">The command type containing the DTO.</typeparam>
/// <typeparam name="TDto">The DTO type inheriting from BaseActivityDto.</typeparam>
public class BaseActivityValidator<T, TDto> : AbstractValidator<T> where TDto : BaseActivityDto
{
    /// <summary>
    /// Initializes validation rules for common activity fields using a selector to extract the DTO.
    /// </summary>
    /// <param name="selector">Function that selects the DTO from the command object.</param>
    public BaseActivityValidator(Func<T, TDto> selector)
    {
        RuleFor(x => selector(x).Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title must not excees 100 characters");

        RuleFor(x => selector(x).Description)
            .NotEmpty().WithMessage("Description is required");

        RuleFor(x => selector(x).Date)
            .GreaterThan(DateTime.UtcNow).WithMessage("Date must be in the future");

        RuleFor(x => selector(x).Category)
            .NotEmpty().WithMessage("Category is required");

        RuleFor(x => selector(x).City)
            .NotEmpty().WithMessage("City is required");

        RuleFor(x => selector(x).Venue)
            .NotEmpty().WithMessage("Venue is required");

        RuleFor(x => selector(x).Latitude)
            .NotEmpty().WithMessage("Latitude is required")
            .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90");
            
        RuleFor(x => selector(x).Longitude)
            .NotEmpty().WithMessage("Longitude is required")
            .InclusiveBetween(-180, 180).WithMessage("Longitude must be between -180 and 180");
    }
}
