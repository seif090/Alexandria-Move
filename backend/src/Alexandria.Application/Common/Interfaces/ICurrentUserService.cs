namespace Alexandria.Application.Common.Interfaces;

public interface ICurrentUserService
{
    string? UserId { get; }
    string? Email { get; }
    string? FullName { get; }
    string? IpAddress { get; }
    bool IsAuthenticated { get; }
    bool IsInRole(string role);
    string[] Roles { get; }
}
