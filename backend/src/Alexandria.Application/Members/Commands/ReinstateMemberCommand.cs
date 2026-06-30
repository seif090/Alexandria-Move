using Alexandria.Application.Common.Models;
using MediatR;

namespace Alexandria.Application.Members.Commands;

public class ReinstateMemberCommand : IRequest<Result>
{
    public Guid Id { get; set; }
}