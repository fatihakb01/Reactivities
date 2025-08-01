using System;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence;

/// <summary>
/// Provides methods for seeding the database with initial data such as users and activities.
/// </summary>
public class DbInitializer
{
    /// <summary>
    /// Seeds the database with initial users and activities if they do not already exist.
    /// </summary>
    /// <param name="context">
    /// The <see cref="AppDbContext"/> used to access and modify the application's database.
    /// </param>
    /// <param name="userManager">
    /// The <see cref="UserManager{TUser}"/> used to create and manage user accounts.
    /// </param>
    /// <returns>
    /// A task that represents the asynchronous seeding operation.
    /// </returns>
    /// <remarks>
    /// This method will:
    /// <list type="bullet">
    /// <item><description>Create a set of dummy users if no users currently exist.</description></item>
    /// <item><description>Create and add a predefined list of activities if the database has no existing activities.</description></item>
    /// <item><description>Save the new data to the database.</description></item>
    /// </list>
    /// </remarks>
    public static async Task SeedData(AppDbContext context, UserManager<User> userManager)
    {
        // Create dummy users if they don't exist
        var users = new List<User>
            {
                new() {DisplayName = "Bob", UserName = "bob@test.com", Email = "bob@test.com"},
                new() {DisplayName = "Tom", UserName = "tom@test.com", Email = "tom@test.com"},
                new() {DisplayName = "Jane", UserName = "jane@test.com", Email = "jane@test.com"}
            };

        if (!userManager.Users.Any())
        {
            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }

        // exit if there is already data
        if (context.Activities.Any()) return;

        // Define activities
        var activities = new List<Activity>
        {
            new()
            {
                Title = "Past Activity 1",
                Date = DateTime.Now.AddMonths(-2),
                Description = "Activity 2 months ago",
                Category = "drinks",
                City = "London",
                Venue =
                    "The Lamb and Flag, 33, Rose Street, Seven Dials, Covent Garden, London, Greater London, England, WC2E 9EB, United Kingdom",
                Latitude = 51.51171665,
                Longitude = -0.1256611057818921,
                Attendees =
                [
                    new()
                    {
                        UserId = users[0].Id,
                        IsHost = true,
                    },
                    new()
                    {
                        UserId = users[1].Id,
                        IsHost = false,
                    }
                ]
            },
            new()
            {
                Title = "Past Activity 2",
                Date = DateTime.Now.AddMonths(-1),
                Description = "Activity 1 month ago",
                Category = "culture",
                City = "Paris",
                Venue =
                    "Louvre Museum, Rue Saint-Honoré, Quartier du Palais Royal, 1st Arrondissement, Paris, Ile-de-France, Metropolitan France, 75001, France",
                Latitude = 48.8611473,
                Longitude = 2.33802768704666,
                Attendees =
                [
                    new()
                    {
                        UserId = users[1].Id,
                        IsHost = true,
                    },
                    new()
                    {
                        UserId = users[2].Id
                    },
                    new()
                    {
                        UserId = users[0].Id,
                    }
                ]
            },
            new()
            {
                Title = "Future Activity 1",
                Date = DateTime.Now.AddMonths(1),
                Description = "Activity 1 month in future",
                Category = "culture",
                City = "London",
                Venue = "Natural History Museum",
                Latitude = 51.496510900000004,
                Longitude = -0.17600190725447445,
                Attendees =
                [
                    new()
                    {
                        UserId = users[2].Id,
                        IsHost = true,
                    }
                ]
            },
            new()
            {
                Title = "Future Activity 2",
                Date = DateTime.Now.AddMonths(2),
                Description = "Activity 2 months in future",
                Category = "music",
                City = "London",
                Venue = "The O2",
                Latitude = 51.502936649999995,
                Longitude = 0.0032029278126681844,
                Attendees =
                [
                    new()
                    {
                        UserId = users[0].Id,
                        IsHost = true,
                    },
                    new()
                    {
                        UserId = users[2].Id
                    }
                ]
            },
            new()
            {
                Title = "Future Activity 3",
                Date = DateTime.Now.AddMonths(3),
                Description = "Activity 3 months in future",
                Category = "drinks",
                City = "London",
                Venue = "The Mayflower",
                Latitude = 51.501778,
                Longitude = -0.053577,
                Attendees =
                [
                    new()
                    {
                        UserId = users[1].Id,
                        IsHost = true,
                    }
                ]
            },
            new()
            {
                Title = "Future Activity 4",
                Date = DateTime.Now.AddMonths(4),
                Description = "Activity 4 months in future",
                Category = "drinks",
                City = "London",
                Venue = "The Blackfriar",
                Latitude = 51.512146650000005,
                Longitude = -0.10364680647106028,
                Attendees =
                [
                    new()
                    {
                        UserId = users[2].Id,
                        IsHost = true,
                    },
                    new()
                    {
                        UserId = users[0].Id
                    }
                ]
            },
            new()
            {
                Title = "Future Activity 5",
                Date = DateTime.Now.AddMonths(5),
                Description = "Activity 5 months in future",
                Category = "culture",
                City = "London",
                Venue =
                    "Sherlock Holmes Museum, 221b, Baker Street, Marylebone, London, Greater London, England, NW1 6XE, United Kingdom",
                Latitude = 51.5237629,
                Longitude = -0.1584743,
                Attendees =
                [
                    new()
                    {
                        UserId = users[0].Id,
                        IsHost = true,
                    }
                ]
            },
            new()
            {
                Title = "Future Activity 6",
                Date = DateTime.Now.AddMonths(6),
                Description = "Activity 6 months in future",
                Category = "music",
                City = "London",
                Venue =
                    "Roundhouse, Chalk Farm Road, Maitland Park, Chalk Farm, London Borough of Camden, London, Greater London, England, NW1 8EH, United Kingdom",
                Latitude = 51.5432505,
                Longitude = -0.15197608174931165,
                Attendees =
                [
                    new()
                    {
                        UserId = users[1].Id,
                        IsHost = true,
                    },
                    new()
                    {
                        UserId = users[0].Id
                    }
                ]
            },
            new()
            {
                Title = "Future Activity 7",
                Date = DateTime.Now.AddMonths(7),
                Description = "Activity 7 months in future",
                Category = "travel",
                City = "London",
                Venue = "River Thames, England, United Kingdom",
                Latitude = 51.5575525,
                Longitude = -0.781404,
                Attendees =
                [
                    new()
                    {
                        UserId = users[2].Id,
                        IsHost = true,
                    },
                    new()
                    {
                        UserId = users[1].Id
                    }
                ]
            },
            new()
            {
                Title = "Future Activity 8",
                Date = DateTime.Now.AddMonths(8),
                Description = "Activity 8 months in future",
                Category = "film",
                City = "London",
                Venue = "Odeon Leicester Square",
                Latitude = 51.5575525,
                Longitude = -0.781404,
                Attendees =
                [
                    new()
                    {
                        UserId = users[0].Id,
                        IsHost = true,
                    }
                ]
            }
        };

        // Add activities to database and save changes
        context.Activities.AddRange(activities);
        await context.SaveChangesAsync();
    }
}
