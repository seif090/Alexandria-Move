using System.Text;
using Alexandria.Application.Common.Interfaces;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Members.Queries;

public class ExportMembersQueryHandler : IRequestHandler<ExportMembersQuery, byte[]>
{
    private readonly IApplicationDbContext _context;

    public ExportMembersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<byte[]> Handle(ExportMembersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.CommunityMembers
            .Include(m => m.User)
            .Include(m => m.Community)
            .AsQueryable();

        if (request.CommunityId.HasValue)
            query = query.Where(m => m.CommunityId == request.CommunityId.Value);

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<MemberStatus>(request.Status, true, out var status))
            query = query.Where(m => m.Status == status);

        var members = await query.ToListAsync(cancellationToken);

        var sb = new StringBuilder();
        sb.AppendLine("Community,UserName,UserEmail,Role,Status,JoinedAt");
        foreach (var m in members)
        {
            sb.AppendLine($"{m.Community.Name},{m.User.FullName},{m.User.Email},{m.Role},{m.Status},{m.JoinedAt:yyyy-MM-dd}");
        }

        return Encoding.UTF8.GetBytes(sb.ToString());
    }
}
