using Alexandria.Application.Common.Models;
using Alexandria.Application.Payments.DTOs;
using MediatR;

namespace Alexandria.Application.Payments.Queries;

public class GetPaymentsQuery : SearchRequest, IRequest<PaginatedList<PaymentDto>>
{
    public Guid? UserId { get; set; }
    public string? Status { get; set; }
    public string? PaymentMethod { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
