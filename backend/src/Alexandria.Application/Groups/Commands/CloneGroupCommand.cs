using Alexandria.Application.Common.Models;
using Alexandria.Application.Groups.DTOs;
using MediatR;

namespace Alexandria.Application.Groups.Commands;

public class CloneGroupCommand : IRequest<Result<GroupDto>>
{
    public Guid SourceGroupId { get; set; }
    public string NewName { get; set; } = string.Empty;
}
