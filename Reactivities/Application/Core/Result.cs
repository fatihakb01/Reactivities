using System;

namespace Application.Core;

// Class for return result object
// Request is going to return succes or failure
public class Result<T>
{
    public bool IsSuccess { get; set; }
    public T? Value { get; set; }
    public string? Error { get; set; }
    public int Code { get; set; }

    public static Result<T> Success(T value) => new() { IsSuccess = true, Value = value };
    public static Result<T> Failure(string error, int code) => new()
    {
        IsSuccess = false,
        Error = error,
        Code = code
    };
}
