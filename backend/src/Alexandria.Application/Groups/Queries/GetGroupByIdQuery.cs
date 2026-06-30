using Alexandria.Application.Common.Models;
using Alexandria.Application.Groups.DTOs;
using MediatR;

namespace Alexandria.Application.Groups.Queries;

public class GetGroupByIdQuery : IRequest<Result<GroupDto>>
{
    public Guid Id { get; set; }
}
