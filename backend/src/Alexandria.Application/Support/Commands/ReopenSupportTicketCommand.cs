using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Commands;

public class ReopenSupportTicketCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}