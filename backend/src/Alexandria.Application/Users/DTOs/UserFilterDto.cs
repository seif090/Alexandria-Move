namespace Alexandria.Application.Users.DTOs;

public class UserFilterDto
{
    public string? SearchTerm { get; set; }
    public bool? IsActive { get; set; }
    public bool? IsVerified { get; set; }
    public string? RoleName { get; set; }
    public DateTime? RegisteredFrom { get; set; }
    public DateTime? RegisteredTo { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
}
