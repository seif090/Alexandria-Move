using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Drivers.Queries;

public class GetDriverRatingQuery : IRequest<Result<object>>
{
    public Guid DriverId { get; set; }
}