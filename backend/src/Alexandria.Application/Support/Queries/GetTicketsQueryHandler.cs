using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Support.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Support.Queries;

public class GetTicketsQueryHandler : IRequestHandler<GetTicketsQuery, PaginatedList<SupportTicketDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTicketsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<SupportTicketDto>> Handle(GetTicketsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.SupportTickets
            .Include(t => t.User)
            .AsQueryable();

        if (request.UserId.HasValue)
            query = query.Where(t => t.UserId == request.UserId.Value);

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<SupportTicketStatus>(request.Status, true, out var status))
            query = query.Where(t => t.Status == status);

        if (!string.IsNullOrWhiteSpace(request.Priority) && Enum.TryParse<SupportTicketPriority>(request.Priority, true, out var priority))
            query = query.Where(t => t.Priority == priority);

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(t => t.Subject.ToLower().Contains(term) || t.Message.ToLower().Contains(term));
        }

        query = request.SortBy switch
        {
            "subject" => request.SortDescending ? query.OrderByDescending(t => t.Subject) : query.OrderBy(t => t.Subject),
            "priority" => request.SortDescending ? query.OrderByDescending(t => t.Priority) : query.OrderBy(t => t.Priority),
            "status" => request.SortDescending ? query.OrderByDescending(t => t.Status) : query.OrderBy(t => t.Status),
            "createdAt" => request.SortDescending ? query.OrderByDescending(t => t.CreatedAt) : query.OrderBy(t => t.CreatedAt),
            _ => query.OrderByDescending(t => t.CreatedAt)
        };

        return await PaginatedList<SupportTicketDto>.CreateAsync(
            query.ProjectTo<SupportTicketDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
