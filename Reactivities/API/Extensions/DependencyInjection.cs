using API.Middleware;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

namespace API.Extensions
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApiServices(
            this IServiceCollection services, IConfiguration config
           )
        {
            // ---------- CONTROLLERS ----------
            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();

                opt.Filters.Add(new AuthorizeFilter(policy));
            });

            // ---------- CORS ----------
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicyName", policy =>
                {
                    policy.WithOrigins(config["ClientAppUrl"]!)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            // ---------- SignalR ----------
            services.AddSignalR();

            // ---------- MEDIATOR & PIPELINES ----------
            services.AddTransient(
                typeof(IPipelineBehavior<,>),
                typeof(ValidationBehavior<,>)
            );

            // ---------- MIDDLEWARE ----------
            services.AddTransient<ExceptionMiddleware>();

            return services;
        }
    }
}
