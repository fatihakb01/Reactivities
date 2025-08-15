using System;

namespace Application.Core;

/// <summary>
/// Represents a paginated list of items with an optional cursor for retrieving the next page.
/// </summary>
/// <typeparam name="T">The type of items in the list.</typeparam>
/// <typeparam name="TCursor">The type of the cursor used for pagination.</typeparam>
public class PagedList<T, TCursor>
{
    public List<T> Items { get; set; } = [];
    public TCursor? NextCursor { get; set; }
}
