using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Routes.Commands;

public class PublishRouteCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}