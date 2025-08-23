using System;

namespace Infrastructure.Photos;

/// <summary>
/// Represents the configuration settings for the Cloudinary service.
/// These settings are loaded from the application's configuration.
/// </summary>
public class CloudinarySettings
{
    public required string CloudName { get; set; }
    public required string ApiKey { get; set; }
    public required string ApiSecret { get; set; }
} 
