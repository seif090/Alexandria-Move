using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Alexandria.API.Filters;

public class ApiResponseFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context) { }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Result is ObjectResult objectResult)
        {
            var statusCode = objectResult.StatusCode ?? 200;
            var response = new
            {
                statusCode,
                success = statusCode >= 200 && statusCode < 300,
                data = objectResult.Value,
                timestamp = DateTime.UtcNow
            };
            context.Result = new ObjectResult(response) { StatusCode = statusCode };
        }
    }
}
