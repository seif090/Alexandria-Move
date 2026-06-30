using Alexandria.Application.Common.Models;
using Alexandria.Application.Users.DTOs;
using MediatR;

namespace Alexandria.Application.Users.Queries;

public class GetUserByIdQuery : IRequest<Result<UserDto>>
{
    public Guid Id { get; set; }
}
