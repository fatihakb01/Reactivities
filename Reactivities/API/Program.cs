using API.Middleware;
using Application.Activities.Queries;
using Application.Activities.Validators;
using Application.Core;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Persistence;

/// <summary>
/// Entry point for the application. Configures and runs the web server.
/// </summary>
var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllers();

// Configure SQLite database context
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

// Register AutoMapper profiles
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

// Register FluentValidation validators
builder.Services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();

// Register custom middleware
builder.Services.AddTransient<ExceptionMiddleware>();

var app = builder.Build();

// Configure middleware
app.UseMiddleware<ExceptionMiddleware>();

// Set up CORS policy
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod()
    .WithOrigins("http://localhost:3000", "https://localhost:3000")); 

// Map controller endpoints
app.MapControllers();

// Seed database at startup
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync(); // Apply any pending migrations
    await DbInitializer.SeedData(context); // Seed initial data
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration.");
}

// Run the application
app.Run();
