using Domain;
using API.Middleware;
using API.SignalR;

namespace API.Extensions
{
    public static class ApplicationBuilder
    {
        public static void BuildServices(this WebApplication app)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseCors("CorsPolicyName");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.MapControllers();

            app.MapGroup("api").MapIdentityApi<User>();

            app.MapHub<CommentHub>("/comments");

            app.MapFallbackToController("Index", "Fallback");
        }
    }
}
