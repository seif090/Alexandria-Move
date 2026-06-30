using Alexandria.Application.Common.Models;
using Alexandria.Application.Users.DTOs;
using MediatR;

namespace Alexandria.Application.Users.Commands;

public class UpdateUserCommand : IRequest<Result<UserDto>>
{
    public Guid Id { get; set; }
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ProfileImageUrl { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
}
