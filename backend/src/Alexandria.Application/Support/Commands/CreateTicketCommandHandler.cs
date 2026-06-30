using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Support.DTOs;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;
using AutoMapper;
using MediatR;

namespace Alexandria.Application.Support.Commands;

public class CreateTicketCommandHandler : IRequestHandler<CreateTicketCommand, Result<SupportTicketDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUser;
    private readonly IDateTime _dateTime;

    public CreateTicketCommandHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUser, IDateTime dateTime)
    {
        _context = context;
        _mapper = mapper;
        _currentUser = currentUser;
        _dateTime = dateTime;
    }

    public async Task<Result<SupportTicketDto>> Handle(CreateTicketCommand request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<SupportTicketPriority>(request.Priority, true, out var priority))
            priority = SupportTicketPriority.Medium;

        var ticket = new SupportTicket
        {
            UserId = Guid.Parse(_currentUser.UserId!),
            Subject = request.Subject,
            Message = request.Message,
            Priority = priority,
            Status = SupportTicketStatus.Open,
            CreatedAt = _dateTime.UtcNow
        };

        _context.SupportTickets.Add(ticket);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<SupportTicketDto>.Success(_mapper.Map<SupportTicketDto>(ticket));
    }
}
