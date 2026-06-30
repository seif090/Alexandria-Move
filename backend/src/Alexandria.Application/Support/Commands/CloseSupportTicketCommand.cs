using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Support.Commands;

public class CloseSupportTicketCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}