using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Routes.Commands;

public class ArchiveRouteCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}