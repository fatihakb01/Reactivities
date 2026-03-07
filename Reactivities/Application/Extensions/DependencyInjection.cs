using Application.Activities.Validators;
using Application.Core;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Application.Extensions
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            var asembly = Assembly.GetExecutingAssembly();

            // ---------- MEDIATR ----------
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(asembly));

            // ---------- AUTOMAPPER ----------
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            // ---------- FLUENT VALIDATION ----------
            services.AddValidatorsFromAssembly(asembly);
            //services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();

            return services;
        }
    }
}
