using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Payments.DTOs;
using Alexandria.Domain.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Payments.Queries;

public class GetPaymentsQueryHandler : IRequestHandler<GetPaymentsQuery, PaginatedList<PaymentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPaymentsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<PaymentDto>> Handle(GetPaymentsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Payments.Include(p => p.User).AsQueryable();

        if (request.UserId.HasValue)
            query = query.Where(p => p.UserId == request.UserId.Value);

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<PaymentStatus>(request.Status, true, out var status))
            query = query.Where(p => p.Status == status);

        if (!string.IsNullOrWhiteSpace(request.PaymentMethod))
            query = query.Where(p => p.PaymentMethod == request.PaymentMethod);

        if (request.FromDate.HasValue)
            query = query.Where(p => p.PaidAt >= request.FromDate.Value);

        if (request.ToDate.HasValue)
            query = query.Where(p => p.PaidAt <= request.ToDate.Value);

        query = request.SortBy switch
        {
            "amount" => request.SortDescending ? query.OrderByDescending(p => p.Amount) : query.OrderBy(p => p.Amount),
            "paidAt" => request.SortDescending ? query.OrderByDescending(p => p.PaidAt) : query.OrderBy(p => p.PaidAt),
            "status" => request.SortDescending ? query.OrderByDescending(p => p.Status) : query.OrderBy(p => p.Status),
            _ => query.OrderByDescending(p => p.PaidAt)
        };

        return await PaginatedList<PaymentDto>.CreateAsync(
            query.ProjectTo<PaymentDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
