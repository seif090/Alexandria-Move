using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Commands;

public class ReplyTicketCommand : IRequest<Result>
{
    public Guid TicketId { get; set; }
    public string Message { get; set; } = string.Empty;
}
