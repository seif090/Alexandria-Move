using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;

namespace Alexandria.Application.Roles.DTOs;

public class RoleDto : IMapFrom<Role>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsDefault { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<RolePermissionDto> Permissions { get; set; } = new();
}

public class RolePermissionDto : IMapFrom<RolePermission>
{
    public Guid Id { get; set; }
    public string Permission { get; set; } = string.Empty;
}
