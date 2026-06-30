using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Payments.Queries;

public class GetPaymentsByBookingQuery : IRequest<Result<object>>
{
    public Guid BookingId { get; set; }
}