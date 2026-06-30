using Alexandria.Application.Users.DTOs;
using MediatR;

namespace Alexandria.Application.Users.Queries;

public class ExportUsersQuery : IRequest<byte[]>
{
    public string? SearchTerm { get; set; }
    public bool? IsActive { get; set; }
    public bool? IsVerified { get; set; }
    public string? RoleName { get; set; }
    public string Format { get; set; } = "csv";
}
