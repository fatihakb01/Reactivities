using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// A fallback controller that serves the single-page application's index.html file.
/// This is used to handle all client-side routes, allowing the frontend to manage its own routing.
/// </summary>
[AllowAnonymous]
public class FallBackController : Controller
{
    /// <summary>
    /// Returns the main index.html file for the client-side application.
    /// </summary>
    /// <returns>An <see cref="IActionResult"/> representing the index.html file.</returns>
    public IActionResult Index()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
            "wwwroot", "index.html"), "text/HTML");
    }
}
