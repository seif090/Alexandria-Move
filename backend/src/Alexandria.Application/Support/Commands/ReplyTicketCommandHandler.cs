using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Support.Commands;

public class ReplyTicketCommandHandler : IRequestHandler<ReplyTicketCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IDateTime _dateTime;

    public ReplyTicketCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser, IDateTime dateTime)
    {
        _context = context;
        _currentUser = currentUser;
        _dateTime = dateTime;
    }

    public async Task<Result> Handle(ReplyTicketCommand request, CancellationToken cancellationToken)
    {
        var ticket = await _context.SupportTickets.FirstOrDefaultAsync(t => t.Id == request.TicketId, cancellationToken);
        if (ticket == null) return Result.Failure("Ticket not found");

        var message = new SupportMessage
        {
            TicketId = request.TicketId,
            UserId = Guid.Parse(_currentUser.UserId!),
            Message = request.Message,
            SentAt = _dateTime.UtcNow
        };

        _context.SupportMessages.Add(message);

        ticket.Status = SupportTicketStatus.Replied;
        await _context.SaveChangesAsync(cancellationToken);

        return Result.Success("Reply sent successfully");
    }
}
