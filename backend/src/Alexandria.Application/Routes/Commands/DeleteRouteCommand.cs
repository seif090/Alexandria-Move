using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Routes.Commands;

public class DeleteRouteCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
