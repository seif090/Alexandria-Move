using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Ratings.Queries;

public class GetRatingByIdQuery : IRequest<Result<object>>
{
    public Guid Id { get; set; }
}