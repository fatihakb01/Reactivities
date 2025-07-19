using System;
using FluentValidation;
using MediatR;

namespace Application.Core;

/// <summary>
/// Pipeline behavior for validating MediatR requests using FluentValidation.
/// Automatically throws a ValidationException if validation fails.
/// </summary>
/// <typeparam name="TRequest">The incoming request type.</typeparam>
/// <typeparam name="TResponse">The response type expected from the handler.</typeparam>
public class ValidationBehavior<TRequest, TResponse>(IValidator<TRequest>? validator = null)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{

    /// <summary>
    /// Validates the request before passing it to the handler.
    /// </summary>
    /// <param name="request">The request object to validate.</param>
    /// <param name="next">Delegate to execute the next step in the pipeline.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The response from the next handler in the pipeline.</returns>
    /// <exception cref="ValidationException">Thrown when validation fails.</exception>
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (validator == null) return await next();

        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        return await next();
    }
}
