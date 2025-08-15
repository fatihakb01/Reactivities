using System;

namespace Application.Core;

/// <summary>
/// Represents generic pagination parameters for cursor-based pagination.
/// </summary>
/// <typeparam name="TCursor">
/// The type of the cursor used for pagination. Typically <see cref="DateTime"/> for chronological ordering.
/// </typeparam>
public class PaginationParams<TCursor>
{
    private const int MaxPageSize = 50;
    public TCursor? Cursor { get; set; }
    private int _pageSize = 3;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }
}
