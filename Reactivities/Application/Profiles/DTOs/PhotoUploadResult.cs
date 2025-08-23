using System;

namespace Application.Profiles.DTOs;

/// <summary>
/// Represents the result of uploading a photo to a remote storage service (e.g., Cloudinary).
/// </summary>
public class PhotoUploadResult
{
    public required string PublicId { get; set; }
    public required string Url { get; set; }
}
