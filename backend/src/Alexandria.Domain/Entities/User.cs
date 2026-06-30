using Alexandria.Domain.Enums;

namespace Alexandria.Domain.Entities;

public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public AuthenticationProvider AuthenticationProvider { get; set; }
    public string? GoogleId { get; set; }
    public bool EmailVerified { get; set; }
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
    public DateTime? LockoutEnd { get; set; }
    public int AccessFailedCount { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public virtual ICollection<UserRole> Roles { get; set; } = new HashSet<UserRole>();
    public virtual ICollection<UserDevice> Devices { get; set; } = new HashSet<UserDevice>();
    public virtual ICollection<LoginHistory> LoginHistory { get; set; } = new HashSet<LoginHistory>();
    public virtual ICollection<UserActivity> Activities { get; set; } = new HashSet<UserActivity>();
}
