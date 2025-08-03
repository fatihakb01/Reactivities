using System;
using System.Dynamic;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

/// <summary>
/// The application's primary Entity Framework database context, including identity and domain entities.
/// </summary>
/// <remarks>
/// Inherits from <see cref="IdentityDbContext{TUser}"/> to include support for ASP.NET Identity.
/// </remarks>
public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    /// <summary>
    /// Gets or sets the table of <see cref="Activity"/> entities in the database.
    /// </summary>
    public required DbSet<Activity> Activities { get; set; }

    /// <summary>
    /// Gets or sets the table of <see cref="ActivityAttendee"/> join entities.
    /// </summary>
    public required DbSet<ActivityAttendee> ActivityAttendees { get; set; }

    /// <summary>
    /// Gets or sets the collection of uploaded user photos.
    /// </summary>
    public required DbSet<Photo> Photos { get; set; }

    /// <summary>
    /// Configures the entity relationships and keys using Fluent API.
    /// </summary>
    /// <param name="builder">The model builder used to configure the EF model.</param>
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure composite primary key for the join table
        builder.Entity<ActivityAttendee>(x => x.HasKey(a => new { a.ActivityId, a.UserId }));

        // Configure relationship: ActivityAttendee → User (many-to-one)
        builder.Entity<ActivityAttendee>()
            .HasOne(x => x.User)
            .WithMany(x => x.Activities)
            .HasForeignKey(x => x.UserId);

        // Configure relationship: ActivityAttendee → Activity (many-to-one)
        builder.Entity<ActivityAttendee>()
            .HasOne(x => x.Activity)
            .WithMany(x => x.Attendees)
            .HasForeignKey(x => x.ActivityId);
    }
}
