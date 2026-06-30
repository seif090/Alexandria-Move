using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Notifications.Commands;

public class MarkAsReadCommandHandler : IRequestHandler<MarkAsReadCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTime _dateTime;

    public MarkAsReadCommandHandler(IApplicationDbContext context, IDateTime dateTime)
    {
        _context = context;
        _dateTime = dateTime;
    }

    public async Task<Result> Handle(MarkAsReadCommand request, CancellationToken cancellationToken)
    {
        var notification = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == request.Id, cancellationToken);
        if (notification == null) return Result.Failure("Notification not found");

        notification.IsRead = true;
        notification.ReadAt = _dateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success("Notification marked as read");
    }
}
