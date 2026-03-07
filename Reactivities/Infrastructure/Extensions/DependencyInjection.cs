using Application.Interfaces;
using Domain;
using Infrastructure.Email;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence;
using Resend;

namespace Infrastructure.Extensions
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services, IConfiguration config
        )
        {
            // --- Database ---
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    config.GetConnectionString("DefaultConnection"),
                    opt => opt.CommandTimeout(900).EnableRetryOnFailure()
                )
            );

            // ---------- AUTHORIZATION ----------
            services.AddIdentityApiEndpoints<User>(opt =>
            {
                opt.User.RequireUniqueEmail = true;
                opt.SignIn.RequireConfirmedEmail = true;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>();

            // ---------- AUTHORIZATION ----------
            services.AddAuthorizationBuilder()
                .AddPolicy("IsActivityHost", policy => policy.Requirements.Add(new IsHostRequirement())
            );

            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

            // ---------- SERVICES ----------
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoService, PhotoService>();

            // ---------- EMAIL ----------
            services.AddHttpClient<IResend, ResendClient>();
            services.Configure<ResendClientOptions>(opt =>
            {
                opt.ApiToken = config["Resend:ApiToken"]!;
            });

            services.AddTransient<IEmailSender<User>, EmailSender>();

            // ---------- CLOUDINARY ----------
            services.Configure<CloudinarySettings>(
                config.GetSection("CloudinarySettings")
            );

            return services;
        }
    }
}
