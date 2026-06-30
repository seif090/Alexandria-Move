using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Queries;

public class GetTicketMessagesQuery : IRequest<Result<object>>
{
    public Guid TicketId { get; set; }
}