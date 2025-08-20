using API.Middleware;
using API.SignalR;
using Application.Activities.Queries;
using Application.Activities.Validators;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using Infrastructure.Email;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Resend;

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
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Enable CORS (cross-origin resource sharing)
builder.Services.AddCors();

// Enable SignalR
builder.Services.AddSignalR();

// Add MediatR with pipeline behaviors
builder.Services.AddMediatR(x =>
{
    x.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>();
    x.AddOpenBehavior(typeof(ValidationBehavior<,>)); // Register validation pipeline behavior
});

// Add Resend email service
builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(opt =>
{
    opt.ApiToken = builder.Configuration["Resend:ApiToken"]!;
});
builder.Services.AddTransient<IResend, ResendClient>();
builder.Services.AddTransient<IEmailSender<User>, EmailSender>();

// Register the current user accessor service
builder.Services.AddScoped<IUserAccessor, UserAccessor>();

// Register the photo service
builder.Services.AddScoped<IPhotoService, PhotoService>();

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
    opt.SignIn.RequireConfirmedEmail = true;
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

// Register the cloudinary settings
builder.Services.Configure<CloudinarySettings>(builder.Configuration
    .GetSection("CloudinarySettings"));

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

// Use default & static files (necessary for production)
app.UseDefaultFiles();
app.UseStaticFiles();

// Map controller endpoints
app.MapControllers();

// Map Identity API endpoints under the "api" route
app.MapGroup("api").MapIdentityApi<User>();

// Map Hub API endpoints under the "comments" route
app.MapHub<CommentHub>("/comments");

// Map to FallbackController
app.MapFallbackToController("Index", "Fallback");

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
