using Alexandria.Application.Common.Models;
using Alexandria.Application.Support.DTOs;
using MediatR;

namespace Alexandria.Application.Support.Queries;

public class GetTicketsQuery : SearchRequest, IRequest<PaginatedList<SupportTicketDto>>
{
    public Guid? UserId { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
}
