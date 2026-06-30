using Alexandria.Application.Common.Mappings;
using Alexandria.Domain.Entities;
using Alexandria.Domain.Enums;

namespace Alexandria.Application.Users.DTOs;

public class UserDto : IMapFrom<User>
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? ProfileImageUrl { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public string? Address { get; set; }
    public UserStatus Status { get; set; }
    public DateTime RegistrationDate { get; set; }
    public DateTime? LastLogin { get; set; }
    public bool IsVerified { get; set; }
    public bool TwoFactorEnabled { get; set; }
    public List<string> Roles { get; set; } = new();
}
