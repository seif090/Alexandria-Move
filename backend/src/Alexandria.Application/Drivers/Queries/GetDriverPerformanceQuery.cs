using Alexandria.Application.Drivers.DTOs;
using MediatR;

namespace Alexandria.Application.Drivers.Queries;

public class GetDriverPerformanceQuery : IRequest<DriverScoreDto>
{
    public Guid DriverId { get; set; }
}
