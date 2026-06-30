using Alexandria.Application.Common.Models;
using Alexandria.Application.Communities.DTOs;
using MediatR;

namespace Alexandria.Application.Communities.Queries;

public class GetCommunityByIdQuery : IRequest<Result<CommunityDto>>
{
    public Guid Id { get; set; }
}
