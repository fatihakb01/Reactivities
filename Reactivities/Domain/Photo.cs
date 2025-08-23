using System;
using System.Text.Json.Serialization;

namespace Domain;

/// <summary>
/// Represents a user-uploaded photo stored in a remote service.
/// </summary>
public class Photo
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Url { get; set; }
    public required string PublicId { get; set; }
    public required string UserId { get; set; }
    [JsonIgnore]
    public User User { get; set; } = null!;
}
