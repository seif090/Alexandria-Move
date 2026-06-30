using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Support.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Support.Queries;

public class GetTicketByIdQueryHandler : IRequestHandler<GetTicketByIdQuery, Result<SupportTicketDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTicketByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<SupportTicketDto>> Handle(GetTicketByIdQuery request, CancellationToken cancellationToken)
    {
        var ticket = await _context.SupportTickets
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

        if (ticket == null) return Result<SupportTicketDto>.Failure("Ticket not found");

        return Result<SupportTicketDto>.Success(_mapper.Map<SupportTicketDto>(ticket));
    }
}
