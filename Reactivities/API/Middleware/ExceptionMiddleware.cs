using System;
using System.Text.Json;
using Application.Core;
using FluentValidation;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;

/// <summary>
/// Middleware to handle unhandled exceptions and return appropriate HTTP responses.
/// Also processes FluentValidation exceptions with structured error details.
/// </summary>
/// <param name="logger">Logger for writing exception logs.</param>
/// <param name="env">Hosting environment used to determine whether to show stack traces.</param>
public class ExceptionMiddleware(ILogger<ExceptionMiddleware> logger, IHostEnvironment env) 
    : IMiddleware
{
    /// <summary>
    /// Main entry point for middleware execution.
    /// Catches and handles exceptions thrown in the request pipeline.
    /// </summary>
    /// <param name="context">HTTP context for the current request.</param>
    /// <param name="next">Delegate to invoke the next middleware component.</param>
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ex)
        {
            await HandleValidationException(context, ex);
        }
        catch (Exception ex)
        {
            await HandleException(context, ex);
        }
    }

    /// <summary>
    /// Handles generic exceptions and logs them.
    /// </summary>
    /// <param name="context">The current HTTP context.</param>
    /// <param name="ex">The exception that occurred.</param>
    private async Task HandleException(HttpContext context, Exception ex)
    {
        logger.LogError(ex, ex.Message);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        var response = env.IsDevelopment()
            ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace)
            : new AppException(context.Response.StatusCode, ex.Message, null);

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        var json = JsonSerializer.Serialize(response, options);

        await context.Response.WriteAsync(json);
    }

    /// <summary>
    /// Handles FluentValidation exceptions and returns a structured 400 Bad Request response.
    /// </summary>
    /// <param name="context">The current HTTP context.</param>
    /// <param name="ex">The validation exception that occurred.</param>
    private static async Task HandleValidationException(HttpContext context, ValidationException ex)
    {
        var validationErrors = new Dictionary<string, string[]>();

        if (ex.Errors is not null)
        {
            foreach (var error in ex.Errors)
            {
                if (validationErrors.TryGetValue(error.PropertyName, out var existingErrors))
                {
                    validationErrors[error.PropertyName] = existingErrors.Append(error.ErrorMessage).ToArray();
                }
                else
                {
                    validationErrors[error.PropertyName] = [error.ErrorMessage];
                }
            }
        }

        context.Response.StatusCode = StatusCodes.Status400BadRequest;

        var validationProblemDetails = new ValidationProblemDetails(validationErrors)
        {
            Status = StatusCodes.Status400BadRequest,
            Type = "ValidationFailure",
            Title = "Validation error",
            Detail = "One or more validation errors has occurred"
        };

        await context.Response.WriteAsJsonAsync(validationProblemDetails);
    }
}
