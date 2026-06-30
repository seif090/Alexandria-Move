namespace Alexandria.Application.Roles.DTOs;

public class UpdateRoleDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool? IsDefault { get; set; }
}
