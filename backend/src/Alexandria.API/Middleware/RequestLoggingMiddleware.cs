using Serilog;
using System.Diagnostics;

namespace Alexandria.API.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public RequestLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        var method = context.Request.Method;
        var path = context.Request.Path;

        await _next(context);

        sw.Stop();
        Log.Information("{Method} {Path} responded {StatusCode} in {ElapsedMs}ms",
            method, path, context.Response.StatusCode, sw.ElapsedMilliseconds);
    }
}
