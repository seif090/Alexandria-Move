using Alexandria.Application.Common.Interfaces;
using Alexandria.Application.Common.Models;
using Alexandria.Application.Payments.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Payments.Queries;

public class GetPaymentHistoryQueryHandler : IRequestHandler<GetPaymentHistoryQuery, PaginatedList<PaymentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPaymentHistoryQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedList<PaymentDto>> Handle(GetPaymentHistoryQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Payments
            .Include(p => p.User)
            .Where(p => p.UserId == request.UserId)
            .OrderByDescending(p => p.PaidAt);

        return await PaginatedList<PaymentDto>.CreateAsync(
            query.ProjectTo<PaymentDto>(_mapper.ConfigurationProvider),
            request.PageNumber,
            request.PageSize);
    }
}
