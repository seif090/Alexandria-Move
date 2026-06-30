using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Stops.Commands;

public class DeleteStopCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}
