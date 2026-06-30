using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Support.Commands;

public class UpdateTicketStatusCommandHandler : IRequestHandler<UpdateTicketStatusCommand, Result>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTime _dateTime;

    public UpdateTicketStatusCommandHandler(IApplicationDbContext context, IDateTime dateTime)
    {
        _context = context;
        _dateTime = dateTime;
    }

    public async Task<Result> Handle(UpdateTicketStatusCommand request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<SupportTicketStatus>(request.Status, true, out var status))
            return Result.Failure("Invalid status");

        var ticket = await _context.SupportTickets.FirstOrDefaultAsync(t => t.Id == request.TicketId, cancellationToken);
        if (ticket == null) return Result.Failure("Ticket not found");

        ticket.Status = status;
        if (status == SupportTicketStatus.Resolved) ticket.ResolvedAt = _dateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return Result.Success($"Ticket status updated to {status}");
    }
}
