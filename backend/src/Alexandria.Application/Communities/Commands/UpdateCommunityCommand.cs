using Alexandria.Application.Common.Models;
using Alexandria.Application.Communities.DTOs;
using MediatR;

namespace Alexandria.Application.Communities.Commands;

public class UpdateCommunityCommand : IRequest<Result<CommunityDto>>
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? City { get; set; }
    public string? Area { get; set; }
    public int? MaxMembers { get; set; }
}
