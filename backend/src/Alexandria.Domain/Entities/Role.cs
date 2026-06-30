namespace Alexandria.Domain.Entities;

public class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsSystemRole { get; set; }
    public virtual ICollection<RolePermission> Permissions { get; set; } = new HashSet<RolePermission>();
    public virtual ICollection<UserRole> Users { get; set; } = new HashSet<UserRole>();
    public bool IsDefault { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
