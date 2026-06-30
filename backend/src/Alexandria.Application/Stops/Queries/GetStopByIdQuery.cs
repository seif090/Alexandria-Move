using Alexandria.Application.Common.Models;
using Alexandria.Application.Stops.DTOs;
using MediatR;

namespace Alexandria.Application.Stops.Queries;

public class GetStopByIdQuery : IRequest<Result<StopDto>>
{
    public Guid Id { get; set; }
}
