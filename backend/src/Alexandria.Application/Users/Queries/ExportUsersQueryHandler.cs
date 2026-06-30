using System.Text;
using Alexandria.Application.Common.Interfaces;
using Alexandria.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Alexandria.Application.Users.Queries;

public class ExportUsersQueryHandler : IRequestHandler<ExportUsersQuery, byte[]>
{
    private readonly IApplicationDbContext _context;

    public ExportUsersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<byte[]> Handle(ExportUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(u => u.FullName.ToLower().Contains(term) || u.Email.ToLower().Contains(term));
        }

        if (request.IsActive.HasValue)
            query = query.Where(u => u.Status == (request.IsActive.Value ? UserStatus.Active : UserStatus.Inactive));

        if (request.IsVerified.HasValue)
            query = query.Where(u => u.IsVerified == request.IsVerified.Value);

        var users = await query.ToListAsync(cancellationToken);

        var sb = new StringBuilder();
        sb.AppendLine("FullName,Email,PhoneNumber,Status,IsVerified,RegistrationDate,LastLogin");
        foreach (var user in users)
        {
            sb.AppendLine($"{user.FullName},{user.Email},{user.PhoneNumber},{user.Status},{user.IsVerified},{user.RegistrationDate:yyyy-MM-dd},{user.LastLogin:yyyy-MM-dd}");
        }

        return Encoding.UTF8.GetBytes(sb.ToString());
    }
}
