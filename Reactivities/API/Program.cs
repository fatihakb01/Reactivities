using API.Extensions;
using Application.Extensions;
using Infrastructure.Extensions;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiServices(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

var app = builder.Build();

app.BuildServices();

using var scope = app.Services.CreateScope();
await DbInitializer.Initialize(scope);

app.Run();