using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// Base controller that provides common functionality for all API controllers.
    /// Includes lazy-loaded access to the Mediator and standardized result handling.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        private IMediator? _mediator;

        /// <summary>
        /// Provides access to the MediatR mediator instance via dependency injection.
        /// Lazily resolves the service from the request's service provider.
        /// </summary>
        protected IMediator Mediator =>
        _mediator ??= HttpContext.RequestServices.GetService<IMediator>()
            ?? throw new InvalidOperationException("IMediator service is unavailable");

        /// <summary>
        /// Standardized handler for formatting and returning results from the application layer.
        /// </summary>
        /// <typeparam name="T">The type of the result value.</typeparam>
        /// <param name="result">The result returned from an application request.</param>
        /// <returns>An <see cref="ActionResult"/> with appropriate HTTP status and value.</returns>
        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (!result.IsSuccess && result.Code == 404) return NotFound();

            if (result.IsSuccess && result.Value != null) return Ok(result.Value);

            return BadRequest(result.Error);
        }
    }
}
