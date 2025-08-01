using API.Middleware;
using Application.Activities.Queries;
using Application.Activities.Validators;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

/// <summary>
/// Entry point for the application. Configures services, middleware, and database initialization.
/// </summary>
var builder = WebApplication.CreateBuilder(args);

#region Configure Services

// Add controllers with a global authorization policy (require authenticated user by default)
builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});

// Configure the database context using SQLite and the connection string from configuration
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Enable CORS (cross-origin resource sharing)
builder.Services.AddCors();

// Add MediatR with pipeline behaviors
builder.Services.AddMediatR(x =>
{
    x.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>();
    x.AddOpenBehavior(typeof(ValidationBehavior<,>)); // Register validation pipeline behavior
});

// Register the current user accessor service
builder.Services.AddScoped<IUserAccessor, UserAccessor>();

// Register AutoMapper profiles
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

// Register FluentValidation validators
builder.Services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();

// Register custom middleware
builder.Services.AddTransient<ExceptionMiddleware>();

// Register ASP.NET Core Identity for user and role management
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>();

// Configure custom authorization policy for activity hosts
builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("IsActivityHost", policy =>
    {
        policy.Requirements.Add(new IsHostRequirement());
    });
});

// Register the custom authorization handler for the "IsActivityHost" policy
builder.Services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

#endregion

var app = builder.Build();

#region Configure Middleware

// Use custom exception-handling middleware
app.UseMiddleware<ExceptionMiddleware>();

// Configure CORS to allow requests from the React client
app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("https://localhost:3000") //"http://localhost:3000"
); 

// Enable authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Map controller endpoints
app.MapControllers();

// Map Identity API endpoints under the "api" route
app.MapGroup("api").MapIdentityApi<User>();

#endregion

#region Database Initialization

// Seed database with initial data during application startup
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<AppDbContext>();
    var userManager = services.GetRequiredService<UserManager<User>>();
    await context.Database.MigrateAsync(); // Apply pending EF Core migrations
    await DbInitializer.SeedData(context, userManager); // Seed default users and activities
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration.");
}

#endregion

// Start the application
app.Run();
