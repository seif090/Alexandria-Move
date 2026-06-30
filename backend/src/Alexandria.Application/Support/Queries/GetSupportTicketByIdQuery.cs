using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Queries;

public class GetSupportTicketByIdQuery : IRequest<Result<object>>
{
    public Guid Id { get; set; }
}