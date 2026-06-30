namespace Alexandria.Application.Roles.DTOs;

public class CreateRoleDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsDefault { get; set; }
    public List<string>? Permissions { get; set; }
}
