using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;

namespace Alexandria.Application.Communities.DTOs;

public class CommunityDto : IMapFrom<Community>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public CommunityType Type { get; set; }
    public string City { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public bool IsActive { get; set; }
    public int MemberCount { get; set; }
    public int MaxMembers { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateCommunityDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string Type { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public int MaxMembers { get; set; }
}

public class UpdateCommunityDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? City { get; set; }
    public string? Area { get; set; }
    public int? MaxMembers { get; set; }
}
