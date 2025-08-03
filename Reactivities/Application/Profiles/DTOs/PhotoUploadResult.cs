using System;

namespace Application.Profiles.DTOs;

/// <summary>
/// Represents the result of uploading a photo to a remote storage service (e.g., Cloudinary).
/// </summary>
public class PhotoUploadResult
{
    /// <summary>
    /// Gets or sets the public identifier of the uploaded photo, used for deletion or referencing.
    /// </summary>
    public required string PublicId { get; set; }

    /// <summary>
    /// Gets or sets the secure URL where the uploaded photo is accessible.
    /// </summary>
    public required string Url { get; set; }

}
