using System.Text.Json;
using Alexandria.Application.Common.Interfaces;
using MediatR;

namespace Alexandria.Application.Common.Behaviors;

public class AuditBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ICurrentUserService _currentUser;
    private readonly IAuditService _auditService;

    public AuditBehavior(ICurrentUserService currentUser, IAuditService auditService)
    {
        _currentUser = currentUser;
        _auditService = auditService;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (!_currentUser.IsAuthenticated)
            return await next();

        var requestName = typeof(TRequest).Name;
        var response = await next();

        if (requestName.EndsWith("Command"))
        {
            await _auditService.LogAsync(
                _currentUser.UserId!,
                $"Executed {requestName}",
                requestName,
                string.Empty,
                null,
                JsonSerializer.Serialize(request),
                null,
                _currentUser.IpAddress
            );
        }

        return response;
    }
}
