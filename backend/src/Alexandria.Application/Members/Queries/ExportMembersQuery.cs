using MediatR;

namespace Alexandria.Application.Members.Queries;

public class ExportMembersQuery : IRequest<byte[]>
{
    public Guid? CommunityId { get; set; }
    public string? Status { get; set; }
    public string? Role { get; set; }
    public string Format { get; set; } = "csv";
}
