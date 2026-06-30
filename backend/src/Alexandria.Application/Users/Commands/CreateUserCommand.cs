using Alexandria.Application.Common.Models;
using Alexandria.Application.Users.DTOs;
using MediatR;

namespace Alexandria.Application.Users.Commands;

public class CreateUserCommand : IRequest<Result<UserDto>>
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public List<string>? Roles { get; set; }
}
