using Alexandria.Application.Common.Models;
using Alexandria.Application.Support.DTOs;
using MediatR;

namespace Alexandria.Application.Support.Commands;

public class CreateTicketCommand : IRequest<Result<SupportTicketDto>>
{
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
}
