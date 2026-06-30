using Alexandria.Application.Common.Models;
using Alexandria.Application.Members.DTOs;
using MediatR;

namespace Alexandria.Application.Members.Queries;

public class GetMemberByIdQuery : IRequest<Result<MemberDto>>
{
    public Guid Id { get; set; }
}
