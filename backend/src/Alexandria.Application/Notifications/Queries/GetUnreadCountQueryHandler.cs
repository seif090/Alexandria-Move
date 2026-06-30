using Alexandria.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Notifications.Queries;

public class GetUnreadCountQueryHandler : IRequestHandler<GetUnreadCountQuery, int>
{
    private readonly IApplicationDbContext _context;

    public GetUnreadCountQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(GetUnreadCountQuery request, CancellationToken cancellationToken)
    {
        return await _context.Notifications
            .CountAsync(n => n.UserId.ToString() == request.UserId && !n.IsRead, cancellationToken);
    }
}
