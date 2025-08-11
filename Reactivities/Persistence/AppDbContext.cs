using System;
using System.Dynamic;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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
    /// Gets or sets the collection of comments.
    /// </summary>
    public required DbSet<Comment> Comments { get; set; }

    /// <summary>
    /// Gets or sets the collection of user followings.
    /// </summary>
    public required DbSet<UserFollowing> UserFollowings { get; set; }

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

        // Configure relationship between 2 users (many-to-many)
        builder.Entity<UserFollowing>(x =>
        {
            x.HasKey(k => new { k.ObserverId, k.TargetId });

            x.HasOne(o => o.Observer)
                .WithMany(f => f.Followings)
                .HasForeignKey(o => o.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);

            x.HasOne(o => o.Target)
                .WithMany(f => f.Followers)
                .HasForeignKey(o => o.TargetId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Convert DateTime properties to DateTime Utc
        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
            v => v.ToUniversalTime(),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
        );

        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
            }
        }
    }
}
