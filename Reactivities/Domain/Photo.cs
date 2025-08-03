using System;
using System.Text.Json.Serialization;

namespace Domain;

/// <summary>
/// Represents a user-uploaded photo stored in a remote service.
/// </summary>
public class Photo
{
    /// <summary>
    /// Gets or sets the unique identifier for the photo.
    /// </summary>
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Gets or sets the public URL of the photo.
    /// </summary>
    public required string Url { get; set; }

    /// <summary>
    /// Gets or sets the public ID used by the external storage service (e.g., Cloudinary).
    /// </summary>
    public required string PublicId { get; set; }

    /// <summary>
    /// Gets or sets the foreign key referencing the user who owns this photo.
    /// </summary>
    public required string UserId { get; set; }

    /// <summary>
    /// Gets or sets the navigation property to the owning <see cref="User"/>.
    /// </summary>
    [JsonIgnore]
    public User User { get; set; } = null!;
}
