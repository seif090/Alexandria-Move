namespace Alexandria.Domain.Entities;

public class RolePermission : BaseEntity
{
    public Guid RoleId { get; set; }
    public virtual Role Role { get; set; } = null!;
    public string PermissionGroup { get; set; } = string.Empty;
    public string PermissionName { get; set; } = string.Empty;
    public bool IsGranted { get; set; }
}
