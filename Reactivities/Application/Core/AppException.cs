using System;

namespace Application.Core;

/// <summary>
/// Represents a standardized exception structure used for returning errors to the client.
/// </summary>
/// <param name="statusCode">HTTP status code associated with the error.</param>
/// <param name="message">Error message to return.</param>
/// <param name="details">Optional stack trace or extended error details.</param>
public class AppException(int statusCode, string message, string? details)
{
    public int StatusCode { get; set; } = statusCode;
    public string Message { get; set; } = message;
    public string? Details { get; set; } = details;
}
