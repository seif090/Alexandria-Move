using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Trips.Commands;

public class ReportTripDelayCommand : IRequest<Result>
{    public Guid TripId { get; set; }
}

public class ReportTripDelayCommandHandler : IRequestHandler<ReportTripDelayCommand, Result>
{
    public Task<Result> Handle(ReportTripDelayCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
