using Alexandria.Application.Common.Models;
using Alexandria.Application.Communities.DTOs;
using MediatR;

namespace Alexandria.Application.Communities.Commands;

public class CreateCommunityCommand : IRequest<Result<CommunityDto>>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string Type { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public int MaxMembers { get; set; }
}
