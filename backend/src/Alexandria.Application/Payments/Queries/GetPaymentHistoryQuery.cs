using Alexandria.Application.Common.Models;
using Alexandria.Application.Payments.DTOs;
using MediatR;

namespace Alexandria.Application.Payments.Queries;

public class GetPaymentHistoryQuery : SearchRequest, IRequest<PaginatedList<PaymentDto>>
{
    public Guid UserId { get; set; }

    public Guid PaymentId { get; set; }
}