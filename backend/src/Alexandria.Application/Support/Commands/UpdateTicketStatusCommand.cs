using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Commands;

public class UpdateTicketStatusCommand : IRequest<Result>
{
    public Guid TicketId { get; set; }
    public string Status { get; set; } = string.Empty;
    public Guid Id { get; set; }
}