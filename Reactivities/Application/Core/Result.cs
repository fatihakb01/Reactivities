using System;

namespace Application.Core;

/// <summary>
/// Represents the result of an operation, indicating success or failure.
/// Can hold a value, an error message, and a custom status code.
/// </summary>
/// <typeparam name="T">The type of the value returned in case of success.</typeparam>
public class Result<T>
{
    public bool IsSuccess { get; set; }
    public T? Value { get; set; }
    public string? Error { get; set; }
    public int Code { get; set; }

    /// <summary>
    /// Creates a successful result containing the specified value.
    /// </summary>
    /// <param name="value">The value to return.</param>
    /// <returns>A <see cref="Result{T}"/> indicating success.</returns>
    public static Result<T> Success(T value) => new() { IsSuccess = true, Value = value };

    /// <summary>
    /// Creates a failed result with an error message and status code.
    /// </summary>
    /// <param name="error">The error message.</param>
    /// <param name="code">The status code associated with the error.</param>
    /// <returns>A <see cref="Result{T}"/> indicating failure.</returns>
    public static Result<T> Failure(string error, int code) => new()
    {
        IsSuccess = false,
        Error = error,
        Code = code
    };
}
