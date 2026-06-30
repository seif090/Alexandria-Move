using Alexandria.API.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Alexandria.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[ServiceFilter(typeof(ApiResponseFilter))]
public abstract class BaseApiController : ControllerBase
{
    protected IActionResult OkOrNotFound<T>(T? data)
    {
        if (data == null) return NotFound(new { message = "Resource not found" });
        return Ok(data);
    }
}
