using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Ratings.Commands;

public class UpdateRatingCommand : IRequest<Result>
{    public Guid Id { get; set; }
}

public class UpdateRatingCommandHandler : IRequestHandler<UpdateRatingCommand, Result>
{
    public Task<Result> Handle(UpdateRatingCommand request, CancellationToken cancellationToken)
        => Task.FromResult(Result.Success());
}
