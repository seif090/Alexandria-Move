using Alexandria.Application.Common.Models;
using Alexandria.Application.Support.DTOs;
using MediatR;

namespace Alexandria.Application.Support.Queries;

public class GetTicketByIdQuery : IRequest<Result<SupportTicketDto>>
{
    public Guid Id { get; set; }
}
