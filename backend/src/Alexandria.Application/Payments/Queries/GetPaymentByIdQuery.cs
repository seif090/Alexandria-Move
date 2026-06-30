using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Payments.Queries;

public class GetPaymentByIdQuery : IRequest<Result<object>>
{
    public Guid Id { get; set; }
}