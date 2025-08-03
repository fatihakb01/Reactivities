using System;
using Application.Profiles.DTOs;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces;

/// <summary>
/// Defines operations for uploading and deleting user photos from a remote photo service (e.g., Cloudinary).
/// </summary>
public interface IPhotoService
{
    /// <summary>
    /// Uploads a user photo to the remote photo storage service.
    /// </summary>
    /// <param name="file">The image file to upload.</param>
    /// <returns>A <see cref="PhotoUploadResult"/> containing the uploaded photo's URL and public ID, or null if the file is empty.</returns>
    Task<PhotoUploadResult?> UploadPhoto(IFormFile file);

    /// <summary>
    /// Deletes a photo from the remote photo service using its public ID.
    /// </summary>
    /// <param name="publicId">The public ID of the photo to delete.</param>
    /// <returns>The result message returned by the photo service (e.g., "ok").</returns>
    Task<string> DeletePhoto(string publicId);
}
