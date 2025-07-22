using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

/// <summary>
/// The application's primary database context.
/// </summary>
/// <remarks>
/// Manages the connection to the database and exposes entity sets for queries and CRUD operations.
/// </remarks>
public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    /// <summary>
    /// Gets or sets the Activities table in the database.
    /// </summary>
    public required DbSet<Activity> Activities { get; set; }
}
