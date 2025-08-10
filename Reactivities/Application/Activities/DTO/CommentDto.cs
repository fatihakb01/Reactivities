using System;

namespace Application.Activities.DTO;

/// <summary>
/// Represents a data transfer object (DTO) for a comment.
/// Used to send comment data between the server and client.
/// </summary>
public class CommentDto
{
    public required string Id { get; set; }
    public required string Body { get; set; }
    public DateTime CreatedAt { get; set; }
    public required string UserId { get; set; }
    public required string DisplayName { get; set; }
    public string? ImageUrl { get; set; }
}
