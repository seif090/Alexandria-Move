using Alexandria.Application.Common.Models;
using Alexandria.Application.Drivers.DTOs;
using MediatR;

namespace Alexandria.Application.Drivers.Queries;

public class GetDriverByIdQuery : IRequest<Result<DriverDto>>
{
    public Guid Id { get; set; }
}
