using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Ratings.Commands;

public class DeleteRatingCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}